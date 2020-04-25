import axios, { AxiosInstance } from "axios";

export default class HttpProvider {
  public guestInstance: AxiosInstance;
  public authInstance: AxiosInstance;

  constructor() {
    this.guestInstance = axios.create({
    });
    this.authInstance = axios.create({
    });
  }

}
