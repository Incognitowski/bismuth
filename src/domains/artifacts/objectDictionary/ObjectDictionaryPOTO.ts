import BaseOwnableModel from "@/domains/framework/data/BaseOwnableModel";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";

export default class ObjectDictionaryPOTO extends BaseOwnableModel {
    public objectDictionaryId!: string;
    public name!: string;
    public applicationId!: string;
    public application!: ApplicationPOTO;
    public isPubliclyVisible!: boolean;
}