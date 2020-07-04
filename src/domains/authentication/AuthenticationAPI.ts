import AuthenticationREST from "./AuthenticationREST";
import AuthenticationPOTO from "./AuthenticationPOTO";
import LocalStorageProvider from "@/providers/LocalStorageProvider";

export default class AthenticationAPI {
    private authenticationREST: AuthenticationREST;

    constructor() {
        this.authenticationREST = new AuthenticationREST();
    }

    public async attemptLogin(username: string, password: string) {
        const authenticationPOTO: AuthenticationPOTO = new AuthenticationPOTO(
            username,
            password
        );
        return await this.authenticationREST.attemptAuthentication(authenticationPOTO);
    }

    public isLoggedIn(): boolean {
        return LocalStorageProvider.retrieve().jwt != null;
    }

    public validateJWT() {
        return this.authenticationREST.validateJWT();
    }
}

