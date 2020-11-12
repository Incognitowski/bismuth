import HttpAPIREST from "@/domains/artifacts/httpAPI/HttpAPIREST";
import HttpAPIPOTO from "@/domains/artifacts/httpAPI/HttpAPIPOTO";
import HttpAPIRequestPOTO from "@/domains/artifacts/httpAPI/HttpAPIRequestPOTO";

export default class HttpAPIAPI {

    private httpAPIREST: HttpAPIREST;

    constructor() {
        this.httpAPIREST = new HttpAPIREST();
    }

    public async create(
        projectId: string,
        applicationId: string,
        httpAPI: HttpAPIPOTO
    ) {
        return await this.httpAPIREST.createHTTPAPI(projectId, applicationId, httpAPI);
    }

    public async getHttpAPIsVisibileInApp(
        projectId: string,
        applicationId: string,
    ) {
        return await this.httpAPIREST.getHttpAPIsInApp(projectId, applicationId);
    }

    public async getHttpAPI(
        projectId: string,
        applicationId: string,
        httpAPIId: string
    ) {
        return await this.httpAPIREST.getHttpAPI(projectId, applicationId, httpAPIId);
    }

    public async searchForRequestsWithSearchWord(
        projectId: string,
        applicationId: string,
        httpAPIId: string,
        requestsSearchWord: string
    ) {
        return await this.httpAPIREST.searchForRequestsWithSearchWord(projectId, applicationId, httpAPIId, requestsSearchWord);
    }

    public async searchForRequests(
        projectId: string,
        applicationId: string,
        httpAPIId: string
    ) {
        return await this.httpAPIREST.searchForRequests(projectId, applicationId, httpAPIId);
    }

    public async createHttpAPIRequest(
        projectId: string,
        applicationId: string,
        httpApiId: string,
        httpAPIRequest: HttpAPIRequestPOTO
    ) {
        return await this.httpAPIREST.createHttpAPIRequest(projectId, applicationId, httpApiId, httpAPIRequest);
    }
}