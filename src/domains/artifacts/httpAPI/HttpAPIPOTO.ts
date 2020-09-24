import BaseOwnableModel from "@/domains/framework/data/BaseOwnableModel";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";

export default class HttpAPIPOTO extends BaseOwnableModel {
    public httpAPIId!: string;
    public name!: string;
    public applicationId!: string;
    public application!: ApplicationPOTO;
    public isPubliclyVisible : boolean = false;
}