import UserPOTO from "@/domains/user/UserPOTO";

export default class ProjectEventPOTO {
    public project_event_id?: string;
    public event? : string;
    public project_id? : string;
    public user_id? : string;
    public createdAt?: number;
    public updatedAt?: number | null;
    public softdeletedAt?: number | null;
    public isSoftdeleted?: boolean;
    public user?: UserPOTO | null;
}