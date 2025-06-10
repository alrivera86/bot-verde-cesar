/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FilterQuery, PipelineStage, UpdateWriteOpResult } from 'mongoose';
import { Client, ClientDocument } from 'src/clients/schemas/clients.schema';
import { MailsService } from 'src/mails/mails.service';
import isBase64 from 'is-base64';
import { ClientsService } from 'src/clients/clients.service';
import { GEOCODING_INTERFACE, Geocoder } from 'src/geocoding/interfaces/geocoding.interface';
import AbstractGeocoder from 'src/geocoding/abstract-geocoder';
import { CesarRepository } from './cesar.repository';
import { Cesar, CesarDocument } from './schemas/cesar.schema';
import { CreateCesarDto } from './dto/create-cesar.dto';
import { CesarUpdateData, NewCesarData } from './dto/update-cesar.dto';
import { CesarAIUpdateQuery } from './interfaces/cesar-ai-update-query.interface';
import { Coordinates } from './interfaces/coordinates.interface';
import { RawCesar } from './interfaces/raw-cesar.interface';

@Injectable()
// eslint-disable-next-line import/prefer-default-export
export class CesarService {
  constructor(
    private readonly cesarRepository: CesarRepository,
    private readonly clientsService: ClientsService,
    private readonly mailService: MailsService,
    @Inject(GEOCODING_INTERFACE)
    private readonly geocodingService: Geocoder
  ) {}

  async createCesarEntry(postDataCesar: CreateCesarDto): Promise<CesarDocument> {
    // Hardcodea id_b para Cosemar/Mannheim
    if (Number(postDataCesar.id_c) === 23.0) {
      postDataCesar.id_b = 23001;
    }

    /* Create new document from recieved information. */
    const getClients: ClientDocument[] = await this.clientsService.findByCommunityId(postDataCesar.id_c);
    const { filter } = getClients[0];
    const cesarFormatted: Cesar = this.formatNewCesarDocument(postDataCesar, filter);
    cesarFormatted.loc = await this.geocodingService.cesarReverseGeocode({
      lat: postDataCesar.lat,
      lon: postDataCesar.lon
    });
    /** Ensure coordinates array format. */
    cesarFormatted.loc.coordinates = AbstractGeocoder.toLonLatArray({
      lat: postDataCesar.lat,
      lon: postDataCesar.lon
    });

    /* Check for errors in request data */
    const { img } = postDataCesar;
    if (!isBase64(img, { allowMime: true }) || img === '') {
      cesarFormatted.error = 'Imagen inválida';
      await this.cesarRepository.create(cesarFormatted);
      throw new HttpException('Imagen inválida', HttpStatus.PARTIAL_CONTENT);
    }

    const createdCesar = await this.cesarRepository.create(cesarFormatted);
    return createdCesar;
  }

  /**
   * Update documents in the associated collection.
   * @param filter Criteria to define which documents will be updated.
   * @param newData Data used to perfom the update
   * @returns
   */
  async updateFromAI(filter: FilterQuery<CesarDocument>, newData: NewCesarData): Promise<UpdateWriteOpResult> {
    const update: CesarAIUpdateQuery = { docProcesadoPorIA: newData.docProcesadoPorIA };
    if (newData.error) {
      update.error = newData.error;
    } else {
      update.clase = newData.prediction.clase;
      update.confianza = newData.prediction.confianza;
      update.previous_class = newData.previous_class;
    }
    const updateResult = await this.cesarRepository.updateMany(filter, update);
    return updateResult;
  }

  /**
   * Format a {@link CreateCesarDto} object to comply with
   * {@link Cesar} class.
   * @param postDataCesar Initial object values.
   * @returns The formatted object.
   */
  formatNewCesarDocument(postDataCesar: Partial<RawCesar>, filter: Array<string>): Cesar {
    let cesarFormat: Partial<Cesar & Coordinates> = {};
    cesarFormat.loc = {
      type: 'Point',
      coordinates: [Number(postDataCesar.lon), Number(postDataCesar.lat)]
    };
    cesarFormat.created_at = new Date();
    cesarFormat = { ...cesarFormat, ...postDataCesar };
    delete cesarFormat.lat;
    delete cesarFormat.lon;

    if (filter != null) {
      for (let i = 0, len = filter.length; i < len; i += 1) {
        cesarFormat[filter[i]] = null;
      }
    }

    return cesarFormat as Cesar;
  }

  /**
   * Compare two CesarDocument objects to verify if immediately one after
   * another the traffic light changed from non-red to red. If so, sends a
   * notification mail.
   * @param previousDocument Previous document whose class will be compared.
   * @param newerDocument Same, but newest.
   */
  async notifyIfRedLight(newerDocument: CesarDocument) {
    const classThreshold = 7;
    const consecutive = 2;

    /** No alarm has to be emitted if this new document is not a red light. */
    if (newerDocument.clase < classThreshold) {
      return;
    }

    /** Check if three consecutive new red lights have appeared including this register. */
    const pipeline: PipelineStage[] = [
      {
        /** Get current client documents. */
        $match: {
          id_c: newerDocument.id_c,
          error: null,
          docProcesadoPorIA: true
        }
      },
      {
        /** Sort by descendent creation date. */ $sort: { created_at: -1 }
      },
      {
        /** Get only the three latest valid documents. */ $limit: consecutive
      },
      {
        /** Resort documents. */ $sort: { created_at: 1 }
      }
    ];
    /** Evaluate pipeline. */
    const latestDocuments: CesarDocument[] = await this.cesarRepository.getModel().aggregate(pipeline);

    /** Calculate alert condition. */
    let newDocIsNthThresholdXs = false;
    const enoughDocsToEvaluate = latestDocuments.length === consecutive;
    if (enoughDocsToEvaluate) {
      /** Check there are enough docs above threshold after one doc below threshold. */
      if (latestDocuments[0].clase < classThreshold) {
        let i = 1;
        while (i < consecutive) {
          if (latestDocuments[i].clase < classThreshold) {
            break;
          }
          i += 1;
        }
        if (i === consecutive) {
          newDocIsNthThresholdXs = true;
        }
      }
    }

    /** Verify alert condition. */
    if (!newDocIsNthThresholdXs) {
      return;
    }

    /* Send mail to customer when container turns red */
    const client: Client = await this.clientsService.findOne({ communityId: newerDocument.id_c });
    const mailOptions = {
      to: client.mail,
      subject: `Contenedor PVI:${newerDocument.id_P} lleno`,
      template: 'redLightNotification',
      context: {
        clientName: client.name,
        id_PVI: newerDocument.id_P,
        containerAddress: `${newerDocument.loc.fullAddress}`,
        docDate: new Date(newerDocument.created_at),
        fillingValue: (newerDocument.clase + 1) * 10
      }
    };
    await this.mailService.send(mailOptions);
  }

  /**
   * Return the ```previous_class``` property for a {@link CesarDocument}
   * according to a given previous {@link CesarDocument}. It assumes
   * ```previousDocument``` had ```clase``` value of ```0``` if it had no
   * ```previous_class``` value.
   * @param previousDocument {@link CesarDocument} which its class will be
   * extracted.
   * @returns ```clase``` value of the given {@link CesarDocument} object.
   */
  getPreviousClass(previousDocument: CesarDocument): number {
    if (previousDocument === undefined) {
      return 0;
    }
    if (previousDocument.clase === undefined || previousDocument.clase === null) {
      return 0;
    }
    return previousDocument.clase;
  }

  async updateCesarBatch(cesarUpdatesBatch: CesarUpdateData[]) {
    const results = [];

    /* Process all documents in the array. */
    for (const cesarUpdate of cesarUpdatesBatch) {
      /* If there was an error in AI processing, notification check is
      skipped. */
      const { newData } = cesarUpdate;
      const updatableCesar: CesarDocument = cesarUpdate.doc;
      if (newData.error === undefined) {
        /* Get immediately previous document of the same community */
        let communityPrevDoc: CesarDocument[] | CesarDocument = await this.cesarRepository
          .getModel()
          .find({
            docProcesadoPorIA: true,
            id_c: updatableCesar.id_c,
            error: null
          })
          .sort({ _id: -1 })
          .limit(1)
          .exec();
        // eslint-disable-next-line prefer-destructuring
        communityPrevDoc = communityPrevDoc[0];

        const prevClass = this.getPreviousClass(communityPrevDoc);
        newData.previous_class = prevClass;
        updatableCesar.previous_class = prevClass;
        updatableCesar.clase = newData.prediction.clase;

        await this.notifyIfRedLight(updatableCesar);
      }

      /* Update document */
      // eslint-disable-next-line no-underscore-dangle
      const docFilter: FilterQuery<CesarDocument> = { _id: updatableCesar._id };
      results.push(await this.updateFromAI(docFilter, newData));
    }
    return results;
  }
}
