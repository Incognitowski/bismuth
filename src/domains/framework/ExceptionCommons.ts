import {AxiosError} from "axios";
import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";

export default class ExceptionCommons {

    public static parseErrorMessage(error : AxiosError) : string{
        let message: string;
        try {
            const exception = DefaultHTTPException.fromAxiosError(error);
            message = exception.message;
        } catch (e) {
            message = e;
        }
        return message;
    }

}