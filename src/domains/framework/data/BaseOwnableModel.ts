import UserPOTO from "@/domains/user/UserPOTO";

export default abstract class BaseOwnableModel {
    public createdBy!: UserPOTO;
    public ownedBy!: UserPOTO;
}