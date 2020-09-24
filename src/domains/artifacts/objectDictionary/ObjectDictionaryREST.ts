import HttpProvider from "@/providers/HttpProvider";
import {AxiosResponse} from "axios";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";

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

}