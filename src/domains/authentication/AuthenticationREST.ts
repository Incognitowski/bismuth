import {AxiosResponse} from "axios";
import HttpProvider from "@/providers/HttpProvider";
import AuthenticationPOTO from "./AuthenticationPOTO";

export default class AuthenticationREST {
    private httpProvider: HttpProvider;

    constructor() {
        this.httpProvider = new HttpProvider();
    }

    public async attemptAuthentication(
        authenticationPOTO: AuthenticationPOTO
    ): Promise<AxiosResponse<AuthenticationResponsePOTO>> {
        return this.httpProvider.guestInstance.post("/login", authenticationPOTO);
    }

    public async validateJWT() {
        return this.httpProvider.authInstance.get("/jwt");
    }
}
