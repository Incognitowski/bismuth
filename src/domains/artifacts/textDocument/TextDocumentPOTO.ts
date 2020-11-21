import BaseOwnableModel from "@/domains/framework/data/BaseOwnableModel";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";

export default class TextDocumentPOTO extends BaseOwnableModel {

    public textDocumentId: string = '';
    public applicationId: string = '';
    public name: string = '';
    public content: string = '';

    public application : ApplicationPOTO = new ApplicationPOTO();

}