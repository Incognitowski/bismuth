export default abstract class BaseModel {
    public createdAt!: number;
    public updatedAt!: number;
    public softdeletedAt!: number;
    public isSoftdeleted!: boolean;
}