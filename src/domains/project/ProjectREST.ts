import {AxiosResponse} from "axios";
import HttpProvider from "@/providers/HttpProvider";
import ProjectPOTO from "@/domains/project/ProjectPOTO";

export default class ProjectREST {
    private httpProvider: HttpProvider;

    constructor() {
        this.httpProvider = new HttpProvider();
    }

    public queryProjects(queryString: string): Promise<AxiosResponse<Array<ProjectPOTO>>> {
        return this.httpProvider.authInstance.get("/project/search-by-name/" + queryString);
    }

    public createProject(newProject: ProjectPOTO): Promise<AxiosResponse<ProjectPOTO>> {
        return this.httpProvider.authInstance.post("/project", newProject);
    }

}
