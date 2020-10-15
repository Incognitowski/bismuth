import BaseOwnableModel from "@/domains/framework/data/BaseOwnableModel";

export default class ObjectDictionaryEntryPOTO extends BaseOwnableModel {
    public objectDictionaryEntryId: string = '';
    public name: string = '';
    public description: string = '';
    public objectDictionaryId: string = '';
    public structure: any = {};
}