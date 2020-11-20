import BaseOwnableModel from "@/domains/framework/data/BaseOwnableModel";

export default class TextDocumentPOTO extends BaseOwnableModel {

    public textDocumentId: string = '';
    public applicationId: string = '';
    public content: string = '';

}