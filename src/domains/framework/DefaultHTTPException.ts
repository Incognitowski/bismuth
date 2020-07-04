import {AxiosError, AxiosResponse} from "axios";

export default class DefaultHTTPException {

    constructor(message: string, flags: Array<string>) {
        this.message = message;
        this.flags = flags;
    }

    public static fromAxiosError(axiosError: AxiosError): DefaultHTTPException {
        var response: AxiosResponse<DefaultHTTPException> = <AxiosResponse<DefaultHTTPException>>axiosError.response;
        return new DefaultHTTPException(response.data.message, response.data.flags);
    }

    public message!: string;
    public flags!: Array<string>;
}