import ObjectDictionaryREST from "@/domains/artifacts/objectDictionary/ObjectDictionaryREST";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";
import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";

export default class ObjectDictionaryAPI {

    private objectDictionaryREST: ObjectDictionaryREST;

    constructor() {
        this.objectDictionaryREST = new ObjectDictionaryREST();
    }

    public async createObjectDictionary(
        projectId: string,
        applicationId: string,
        objectDictionary: ObjectDictionaryPOTO
    ) {
        return await this.objectDictionaryREST.createApp(projectId, applicationId, objectDictionary);
    }

    public async getObjectDictionariesInApp(
        projectId: string,
        applicationId: string,
    ) {
        return await this.objectDictionaryREST.getObjectDictionariesInApp(projectId, applicationId);
    }

    public async getObjectDictionary(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string,
    ) {
        return await this.objectDictionaryREST.getObjectDictionary(projectId, applicationId, objectDictionaryId);
    }

    public async createObjectDictionaryEntry(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string,
        objectDictionaryEntry: ObjectDictionaryEntryPOTO
    ) {
        return await this.objectDictionaryREST.createEntry(projectId, applicationId, objectDictionaryId, objectDictionaryEntry);
    }

    public async searchForEntries(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string
    ) {
        return await this.objectDictionaryREST.searchForEntries(projectId, applicationId, objectDictionaryId);
    }

    public async searchForEntriesWithSearchWord(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string,
        entrySearchWord: string
    ) {
        return await this.objectDictionaryREST.searchForEntriesWithSearchWord(projectId, applicationId, objectDictionaryId, entrySearchWord);
    }

    public async updateObjectDictionaryEntry(
        projectId: string,
        applicationId: string,
        objectDictionaryId: string,
        objectDictionaryEntry: ObjectDictionaryEntryPOTO
    ) {
        return await this.objectDictionaryREST.updateObjectDictionaryEntry(
            projectId,
            applicationId,
            objectDictionaryId,
            objectDictionaryEntry
        )
    }
}