import {AxiosResponse} from "axios";
import HttpProvider from "@/providers/HttpProvider";
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import Page from "@/domains/framework/data/Page";
import UserPOTO from "@/domains/user/UserPOTO";
import ProjectVisibilityPOTO from "@/domains/project/projectVisibility/ProjectVisibilityPOTO";
import ProjectEventPOTO from "@/domains/project/projectEvent/ProjectEventPOTO";
import ProjectTransferPOTO from "@/domains/project/ProjectTransferPOTO";

export default class ProjectREST {
    private httpProvider: HttpProvider;

    constructor() {
        this.httpProvider = new HttpProvider();
    }

    public queryProjects(queryString: string): Promise<AxiosResponse<Array<ProjectPOTO>>> {
        return this.httpProvider.authInstance.get("/project/search-by-name/" + queryString);
    }

    public getById(projectId: string): Promise<AxiosResponse<ProjectPOTO>> {
        return this.httpProvider.authInstance.get("/project/" + projectId);
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

    async getUsersRelatedToProject(projectId: string): Promise<AxiosResponse<Array<UserPOTO>>> {
        return this.httpProvider.authInstance.get("/project/" + projectId + "/users");
    }

    async attachUserToProject(visibility: ProjectVisibilityPOTO): Promise<AxiosResponse<ProjectVisibilityPOTO>> {
        return this.httpProvider.authInstance.post("/project/" + visibility.project_id + "/users", visibility);
    }

    async getVisibilityWithProject(projectId: string): Promise<AxiosResponse<ProjectVisibilityPOTO>> {
        return this.httpProvider.authInstance.get("/project/" + projectId + "/visibility");
    }

    async detachUserFromProject(projectVisibility: ProjectVisibilityPOTO): Promise<AxiosResponse<ProjectVisibilityPOTO>> {
        return this.httpProvider.authInstance.delete("/project/" + projectVisibility.project_id + "/visibility/" + projectVisibility.project_visibility_id);
    }

    async getEventsRelatedToProject(projectId: string): Promise<AxiosResponse<Array<ProjectEventPOTO>>> {
        return this.httpProvider.authInstance.get("/project/" + projectId + "/events");
    }

    async transferProject(projectTransferPOTO: ProjectTransferPOTO, projectId: string): Promise<AxiosResponse> {
        return this.httpProvider.authInstance.put("/project/" + projectId + "/transfer", projectTransferPOTO);
    }

    async disableProject(projectId: string): Promise<AxiosResponse> {
        return this.httpProvider.authInstance.delete("/project/" + projectId);
    }


}


