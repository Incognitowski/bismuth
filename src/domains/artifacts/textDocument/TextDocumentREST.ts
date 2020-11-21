import HttpProvider from "@/providers/HttpProvider";
import {AxiosResponse} from "axios";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";
import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";
import TextDocumentPOTO from "@/domains/artifacts/textDocument/TextDocumentPOTO";

export default class TextDocumentREST {

    private httpProvider: HttpProvider;

    constructor() {
        this.httpProvider = new HttpProvider();
    }

    public getTextDocumentsInApp(
        projectId: string,
        applicationId: string,
    ): Promise<AxiosResponse<Array<TextDocumentPOTO>>> {
        return this.httpProvider.authInstance.get(
            `/project/${projectId}/application/${applicationId}/text-document`
        );
    }

    public createDocument(
        projectId: string,
        applicationId: string,
        textDocument: TextDocumentPOTO
    ): Promise<AxiosResponse<TextDocumentPOTO>> {
        return this.httpProvider.authInstance.post(
            `/project/${projectId}/application/${applicationId}/text-document`,
            textDocument
        );
    }

    public editDocument(
        projectId: string,
        applicationId: string,
        textDocument: TextDocumentPOTO
    ): Promise<AxiosResponse<TextDocumentPOTO>> {
        return this.httpProvider.authInstance.put(
            `/project/${projectId}/application/${applicationId}/text-document/${textDocument.textDocumentId}`,
            textDocument
        );
    }
}