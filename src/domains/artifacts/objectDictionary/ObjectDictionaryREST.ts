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
            `/project/${projectId}/application/${applicationId}/object-dictionary`
        );
    }

    public createApp(
        projectId: string,
        applicationId: string,
        objectDictionary: ObjectDictionaryPOTO
    ): Promise<AxiosResponse<ObjectDictionaryPOTO>> {
        return this.httpProvider.authInstance.post(
            `/project/${projectId}/application/${applicationId}/object-dictionary`,
            objectDictionary
        );
    }

    async getObjectDictionary(projectId: string, applicationId: string, objectDictionaryId: string) {
        return this.httpProvider.authInstance.get(
            `/project/${projectId}/application/${applicationId}/object-dictionary/${objectDictionaryId}`
        );
    }

    async createEntry(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string,
        objectDictionaryEntry: ObjectDictionaryEntryPOTO
    ): Promise<AxiosResponse<ObjectDictionaryEntryPOTO>> {
        return this.httpProvider.authInstance.post(
            `/project/${projectId}/application/${applicationId}/object-dictionary/${objectDictionaryId}/entry`,
            objectDictionaryEntry
        );
    }

    async searchForEntries(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string
    ): Promise<AxiosResponse<Array<ObjectDictionaryEntryPOTO>>> {
        return this.httpProvider.authInstance.get(
            `/project/${projectId}/application/${applicationId}/object-dictionary/${objectDictionaryId}/entry`
        );
    }

    async searchForEntriesWithSearchWord(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string,
        entrySearchWord: string
    ): Promise<AxiosResponse<Array<ObjectDictionaryEntryPOTO>>> {
        return this.httpProvider.authInstance.get(
            `/project/${projectId}/application/${applicationId}/object-dictionary/${objectDictionaryId}/entry/search-by-word/${encodeURIComponent(entrySearchWord)}`
        );
    }

    async updateObjectDictionaryEntry(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string,
        objectDictionaryEntry: ObjectDictionaryEntryPOTO
    ): Promise<AxiosResponse<ObjectDictionaryEntryPOTO>> {
        return this.httpProvider.authInstance.put(
            `/project/${projectId}/application/${applicationId}/object-dictionary/${objectDictionaryId}/entry/${objectDictionaryEntry.objectDictionaryEntryId}`,
            objectDictionaryEntry
        );
    }

    async deleteEntry(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string,
        objectDictionaryEntryId: string
    ): Promise<AxiosResponse> {
        return this.httpProvider.authInstance.delete(
            `/project/${projectId}/application/${applicationId}/object-dictionary/${objectDictionaryId}/entry/${objectDictionaryEntryId}`
        );
    }

    async getObjectDictionaryPublicly(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string
    ): Promise<ObjectDictionaryPOTO> {
        return this.httpProvider.guestInstance.get(
            `/project/${projectId}/application/${applicationId}/object-dictionary/${objectDictionaryId}/publicly`
        );
    }
}