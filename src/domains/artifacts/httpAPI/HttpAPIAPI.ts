import HttpAPIREST from "@/domains/artifacts/httpAPI/HttpAPIREST";
import HttpAPIPOTO from "@/domains/artifacts/httpAPI/HttpAPIPOTO";

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

}