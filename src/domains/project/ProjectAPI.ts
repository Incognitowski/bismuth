import ProjectREST from "@/domains/project/ProjectREST";
import ProjectPOTO from "@/domains/project/ProjectPOTO";

export default class ProjectAPI {

    private projectREST: ProjectREST;

    constructor() {
        this.projectREST = new ProjectREST();
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

}