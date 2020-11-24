import axios from "axios";

export default class HttpAPIAPI {

    private getHttpProvider(baseUrl: string) {
        return axios.create({
            baseURL: baseUrl
        });
    }

    public async try(
        baseUrl: string,
        method: string,
        fullUrl: string,
        headers: Array<any>,
        body: any,
    ) {
        switch (method) {
            case "GET":
                return this.runGet(baseUrl, fullUrl, headers, body);
            case "POST":
                return this.runPost(baseUrl, fullUrl, headers, body);
            case "PUT":
                return this.runPut(baseUrl, fullUrl, headers, body);
            case "DELETE":
                return this.runDelete(baseUrl, fullUrl, headers, body);
        }
    }

    private runGet(baseUrl: string, resourceURI: string, headers: Array<any> = [], body: any = '') {
        return this.getHttpProvider(baseUrl).get(resourceURI, {
            headers: headers,
            data: body
        });
    }

    private runPost(baseUrl: string, resourceURI: string, headers: Array<any>, body: any) {
        return this.getHttpProvider(baseUrl).post(resourceURI, body, {
            headers: headers
        });
    }

    private runPut(baseUrl: string, resourceURI: string, headers: Array<any>, body: any) {
        return this.getHttpProvider(baseUrl).put(resourceURI, body, {
            headers: headers
        });
    }

    private runDelete(baseUrl: string, resourceURI: string, headers: Array<any>, body: any) {
        return this.getHttpProvider(baseUrl).delete(resourceURI, {
            headers: headers,
            data: body
        });
    }
}