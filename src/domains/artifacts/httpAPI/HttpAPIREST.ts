import HttpProvider from "@/providers/HttpProvider";
import {AxiosResponse} from "axios";
import HttpAPIPOTO from "@/domains/artifacts/httpAPI/HttpAPIPOTO";
import HttpAPIRequestPOTO from "@/domains/artifacts/httpAPI/HttpAPIRequestPOTO";

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
            `/project/${projectId}/application/${applicationId}/http-api`
        );
    }

    public createHTTPAPI(
        projectId: string,
        applicationId: string,
        httpAPI: HttpAPIPOTO
    ): Promise<AxiosResponse<HttpAPIPOTO>> {
        return this.httpProvider.authInstance.post(
            `/project/${projectId}/application/${applicationId}/http-api`,
            httpAPI
        );
    }

    async getHttpAPI(
        projectId: string,
        applicationId: string,
        httpAPIId: string
    ): Promise<AxiosResponse<HttpAPIPOTO>> {
        return this.httpProvider.authInstance.get(
            `/project/${projectId}/application/${applicationId}/http-api/${httpAPIId}`
        );
    }

    async searchForRequestsWithSearchWord(
        projectId: string,
        applicationId: string,
        httpAPIId: string,
        requestsSearchWord: string
    ): Promise<AxiosResponse<Array<HttpAPIRequestPOTO>>> {
        return this.httpProvider.authInstance.get(
            `/project/${projectId}/application/${applicationId}/http-api/${httpAPIId}/request/search-by-word/${encodeURIComponent(requestsSearchWord)}`
        );
    }


    async searchForRequests(
        projectId: string,
        applicationId: string,
        httpAPIId: string
    ): Promise<AxiosResponse<Array<HttpAPIRequestPOTO>>> {
        return this.httpProvider.authInstance.get(
            `/project/${projectId}/application/${applicationId}/http-api/${httpAPIId}/request`
        );
    }
}