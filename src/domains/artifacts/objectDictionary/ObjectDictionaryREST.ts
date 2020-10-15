import HttpProvider from "@/providers/HttpProvider";
import {AxiosResponse} from "axios";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";
import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";

export default class ObjectDictionaryREST {

    private httpProvider: HttpProvider;

    constructor() {
        this.httpProvider = new HttpProvider();
    }

    public getObjectDictionariesInApp(
        projectId: string,
        applicationId: string,
    ): Promise<AxiosResponse<Array<ObjectDictionaryPOTO>>> {
        return this.httpProvider.authInstance.get(
            "/project/" + projectId + "/application/" + applicationId + "/object-dictionary"
        );
    }

    public createApp(
        projectId: string,
        applicationId: string,
        objectDictionary: ObjectDictionaryPOTO
    ): Promise<AxiosResponse<ObjectDictionaryPOTO>> {
        return this.httpProvider.authInstance.post(
            "/project/" + projectId + "/application/" + applicationId + "/object-dictionary",
            objectDictionary
        );
    }

    async getObjectDictionary(projectId: string, applicationId: string, objectDictionaryId: string) {
        return this.httpProvider.authInstance.get(
            "/project/" + projectId + "/application/" + applicationId + "/object-dictionary/" + objectDictionaryId
        );
    }

    async createEntry(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string,
        objectDictionaryEntry: ObjectDictionaryEntryPOTO
    ): Promise<AxiosResponse<ObjectDictionaryEntryPOTO>> {
        return this.httpProvider.authInstance.post(
            "/project/" + projectId + "/application/" + applicationId + "/object-dictionary/" + objectDictionaryId + "/entry",
            objectDictionaryEntry
        );
    }

    async searchForEntries(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string
    ) : Promise<AxiosResponse<Array<ObjectDictionaryEntryPOTO>>> {
        return this.httpProvider.authInstance.get(
            "/project/" + projectId + "/application/" + applicationId + "/object-dictionary/" + objectDictionaryId + "/entry"
        );
    }
}