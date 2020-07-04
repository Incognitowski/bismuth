import {AxiosResponse} from "axios";
import HttpProvider from "@/providers/HttpProvider";
import UserPOTO from "@/domains/user/UserPOTO";

export default class UserREST {
    private httpProvider: HttpProvider;

    constructor() {
        this.httpProvider = new HttpProvider();
    }

    public async createAccount(
        newUser: UserPOTO
    ): Promise<AxiosResponse<UserPOTO>> {
        return this.httpProvider.guestInstance.post("/user", newUser);
    }

}
