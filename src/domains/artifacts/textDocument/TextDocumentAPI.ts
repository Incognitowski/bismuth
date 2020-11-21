import TextDocumentREST from "@/domains/artifacts/textDocument/TextDocumentREST";
import TextDocumentPOTO from "@/domains/artifacts/textDocument/TextDocumentPOTO";

export default class TextDocumentAPI {

    private textDocumentREST: TextDocumentREST;

    constructor() {
        this.textDocumentREST = new TextDocumentREST();
    }

    public async getAllInApp(
        projectId: string,
        applicationId: string,
    ) {
        return this.textDocumentREST.getTextDocumentsInApp(projectId, applicationId);
    }

    public async createDocument(
        projectId: string,
        applicationId: string,
        textDocument: TextDocumentPOTO
    ) {
        return this.textDocumentREST.createDocument(
            projectId,
            applicationId,
            textDocument
        );
    }

    public async editDocument(
        projectId: string,
        applicationId: string,
        textDocument: TextDocumentPOTO
    ) {
        return this.textDocumentREST.editDocument(
            projectId,
            applicationId,
            textDocument
        );
    }
}