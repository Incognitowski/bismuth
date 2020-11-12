import BaseOwnableModel from "@/domains/framework/data/BaseOwnableModel";

export default class HttpAPIRequestPOTO extends BaseOwnableModel {
    public httpRequestId: string = "";
    public operationId: string = "";
    public path: string = "";
    public method: string = "";
    public description: string = "";
    public parameters: any = [];
    public headers: any = [];
    public requestBodies: any = [];
    public responses: any = [];
    public httpApiId: string = "";
    public deprecated: boolean = false;
    public deprecatedFor: string | null = null;
    public draft: boolean = false;
}