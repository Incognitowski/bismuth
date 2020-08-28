import {AxiosResponse} from "axios";
import HttpProvider from "@/providers/HttpProvider";
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import Page from "@/domains/framework/data/Page";

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

    public editProject(project: ProjectPOTO): Promise<AxiosResponse<ProjectPOTO>> {
        return this.httpProvider.authInstance.put("/project/" + project.projectId, project);
    }

    async getAllProjects(page: number, size: number): Promise<AxiosResponse<Page<ProjectPOTO>>> {
        return this.httpProvider.authInstance.get("/project", {
            params: {
                page,
                size
            }
        })
    }
}
