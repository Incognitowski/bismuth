import HttpProvider from "@/providers/HttpProvider";
import {AxiosResponse} from "axios";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";
import HttpAPIPOTO from "@/domains/artifacts/httpAPI/HttpAPIPOTO";

export default class HttpAPIREST {

    private httpProvider: HttpProvider;

    constructor() {
        this.httpProvider = new HttpProvider();
    }

    public getHttpAPIsInApp(
        projectId: string,
        applicationId: string,
    ): Promise<AxiosResponse<Array<HttpAPIPOTO>>> {
        return this.httpProvider.authInstance.get(
            "/project/" + projectId + "/application/" + applicationId + "/http-api"
        );
    }

    public createHTTPAPI(
        projectId: string,
        applicationId: string,
        httpAPI: HttpAPIPOTO
    ): Promise<AxiosResponse<HttpAPIPOTO>> {
        return this.httpProvider.authInstance.post(
            "/project/" + projectId + "/application/" + applicationId + "/http-api",
            httpAPI
        );
    }

}