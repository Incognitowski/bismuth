import {AxiosResponse} from "axios";
import HttpProvider from "@/providers/HttpProvider";
import UserPOTO from "@/domains/user/UserPOTO";

export default class ProjectREST {
    private httpProvider: HttpProvider;

    constructor() {
        this.httpProvider = new HttpProvider();
    }

    public async queryProjects(
        queryString: string
    ): Promise<AxiosResponse<List<ProjectPOTO>>> {
        return this.httpProvider.authInstance.get("/project/search-by-name/" + queryString);
    }

}
