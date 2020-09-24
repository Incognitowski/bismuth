import ObjectDictionaryREST from "@/domains/artifacts/objectDictionary/ObjectDictionaryREST";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";

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

}