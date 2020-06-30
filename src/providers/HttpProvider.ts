import axios, { AxiosInstance } from "axios";

export default class HttpProvider {
  public guestInstance: AxiosInstance;
  public authInstance: AxiosInstance;

  constructor() {
    this.guestInstance = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
    });
    this.authInstance = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
    });
  }
}
