import UserPOTO from "@/domains/user/UserPOTO";
import ApplicationVisibilityPOTO from "@/domains/application/applicationVisibility/ApplicationVisibilityPOTO";
import ProjectPOTO from "@/domains/project/ProjectPOTO";

export default class ApplicationPOTO {
    public applicationId!: string;
    public projectId!: string;
    public name!: string;
    public active!: boolean;
    public isPubliclyVisible!: boolean;
    public createdAt!: number;
    public updatedAt!: number;
    public softdeletedAt!: number;
    public isSoftdeleted!: boolean;
    public createdBy!: UserPOTO;
    public ownedBy!: UserPOTO;
    public relationShipWithCurrentUser?: ApplicationVisibilityPOTO;
    public project!: ProjectPOTO;
}