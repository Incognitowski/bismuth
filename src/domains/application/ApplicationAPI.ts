import ApplicationREST from "@/domains/application/ApplicationREST";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";

export default class ApplicationAPI {

    private applicationREST: ApplicationREST;

    constructor() {
        this.applicationREST = new ApplicationREST();
    }

    public async createApp(application: ApplicationPOTO) {
        return await this.applicationREST.createApp(application);
    }

    public async searchApplicationsByString(projectId: string, searchString: string) {
        return await this.applicationREST.queryApplications(projectId, searchString);
    }

    public async getAllApplications(projectId: string, page: number, size: number) {
        return await this.applicationREST.getAllApplications(projectId, page, size);
    }

    public async getApplication(projectId: string, applicationId : string) {
        return await this.applicationREST.getApplication(projectId, applicationId);
    }



}