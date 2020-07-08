import ProjectREST from "@/domains/project/ProjectREST";

export default class ProjectAPI {

    private projectREST : ProjectREST;

    constructor() {
        this.projectREST = new ProjectREST();
    }

    public async searchProjectsByString(searchString: string){
        return await this.projectREST.queryProjects(searchString);
    }

}