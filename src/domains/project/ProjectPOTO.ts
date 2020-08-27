import UserPOTO from "@/domains/user/UserPOTO";

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
}