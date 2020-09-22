import HttpProvider from "@/providers/HttpProvider";
import {AxiosResponse} from "axios";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";
import Page from "@/domains/framework/data/Page";

export default class ApplicationREST {

    private httpProvider: HttpProvider;

    constructor() {
        this.httpProvider = new HttpProvider();
    }

    public createApp(application: ApplicationPOTO): Promise<AxiosResponse<ApplicationPOTO>> {
        return this.httpProvider.authInstance.post("/project/" + application.projectId + "/application", application);
    }

    public queryApplications(projectId: string, queryString: string): Promise<AxiosResponse<Array<ApplicationPOTO>>> {
        return this.httpProvider.authInstance.get("/project/" + projectId + "/application/search-by-name/" + queryString);
    }

    async getAllApplications(projectId: string, page: number, size: number): Promise<AxiosResponse<Page<ApplicationPOTO>>> {
        return this.httpProvider.authInstance.get("/project/" + projectId + "/application", {
            params: {
                page,
                size
            }
        })
    }

}