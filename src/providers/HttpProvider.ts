import axios, {AxiosInstance} from "axios";
import LocalStorageProvider from "@/providers/LocalStorageProvider";

export default class HttpProvider {
    public guestInstance: AxiosInstance;
    public authInstance: AxiosInstance;

    constructor() {
        this.guestInstance = HttpProvider.createGuestInstance();
        this.authInstance = HttpProvider.createAuthenticatedInstance();
    }

    private static createGuestInstance() {
        return axios.create({
            baseURL: process.env.VUE_APP_API_URL,
        });
    }

    private static createAuthenticatedInstance() {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_URL,
        });
        instance.defaults.headers["Authorization"] = LocalStorageProvider.retrieve().jwt;
        instance.defaults.headers["Content-Type"] = "application/json";
        return instance;
    }
}
