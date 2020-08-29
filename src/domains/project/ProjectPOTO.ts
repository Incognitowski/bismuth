import UserPOTO from "@/domains/user/UserPOTO";
import ProjectVisibilityPOTO from "@/domains/project/projectVisibility/ProjectVisibilityPOTO";

export default class ProjectPOTO {
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
    public relationShipWithCurrentUser?: ProjectVisibilityPOTO;
}