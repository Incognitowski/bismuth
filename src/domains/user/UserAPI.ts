import UserREST from "@/domains/user/UserREST";
import UserPOTO from "@/domains/user/UserPOTO";

export default class UserAPI {

    private userREST: UserREST;

    constructor() {
        this.userREST = new UserREST();
    }

    public async createAccount(username: string, email: string, password: string) {
        const newUser = new UserPOTO();
        newUser.email = email;
        newUser.password = password;
        newUser.username = username;
        return await this.userREST.createAccount(newUser);
    }

}