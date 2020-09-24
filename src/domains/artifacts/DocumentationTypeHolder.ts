import {ArtifactTypes} from "@/domains/artifacts/ArtifactTypes";

export default interface DocumentationTypeHolder {
    text: string;
    icon: string;
    type: ArtifactTypes;
}