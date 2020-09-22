import ProjectREST from "@/domains/project/ProjectREST";
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import ProjectVisibilityPOTO from "@/domains/project/projectVisibility/ProjectVisibilityPOTO";
import ProjectTransferPOTO from "@/domains/project/ProjectTransferPOTO";

export default class ProjectAPI {

    private projectREST: ProjectREST;

    constructor() {
        this.projectREST = new ProjectREST();
    }

    public async getById(projectId: string) {
        return await this.projectREST.getById(projectId);
    }

    public async searchProjectsByString(searchString: string) {
        return await this.projectREST.queryProjects(searchString);
    }

    public async createProject(newProject: ProjectPOTO) {
        return await this.projectREST.createProject(newProject);
    }

    public async editProject(project: ProjectPOTO) {
        return await this.projectREST.editProject(project);
    }

    public async getAllProjects(page: number, size: number) {
        return await this.projectREST.getAllProjects(page, size);
    }

    public async getUsersRelatedToProject(project: ProjectPOTO) {
        return await this.projectREST.getUsersRelatedToProject(project.projectId);
    }

    public async attachUserToProject(visibility: ProjectVisibilityPOTO){
        return await this.projectREST.attachUserToProject(visibility);
    }

    public async getVisibilityWithProject(project: ProjectPOTO){
        return await this.projectREST.getVisibilityWithProject(project.projectId);
    }

    public async detachUserFromProject(projectVisibility: ProjectVisibilityPOTO){
        return await this.projectREST.detachUserFromProject(projectVisibility);
    }

    public async getEventsRelatedToProject(projectId: string){
        return await this.projectREST.getEventsRelatedToProject(projectId);
    }

    public async transferProject(projectTransferPOTO : ProjectTransferPOTO, project : ProjectPOTO) {
        return await this.projectREST.transferProject(projectTransferPOTO, project.projectId);
    }

    public async disableProject(project : ProjectPOTO) {
        return await this.projectREST.disableProject(project.projectId);
    }

}