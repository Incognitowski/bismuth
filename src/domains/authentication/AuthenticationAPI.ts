import AuthenticationREST from "./AuthenticationREST";
import AuthenticationPOTO from "./AuthenticationPOTO";
import LocalStorageProvider from "@/providers/LocalStorageProvider";

export default class AthenticationAPI {
    private authenticationREST: AuthenticationREST;

    constructor() {
        this.authenticationREST = new AuthenticationREST();
    }

    public attemptLogin(username: string, password: string) {
        var authenticationPOTO: AuthenticationPOTO = new AuthenticationPOTO(
            username,
            password
        );
        return this.authenticationREST.attemptAuthentication(authenticationPOTO);
    }

    public isLoggedIn(): boolean {
        return LocalStorageProvider.retrieve().jwt != null;
    }

    public validateJWT() {
        return this.authenticationREST.validateJWT();
    }
}

