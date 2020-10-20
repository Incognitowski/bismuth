import BaseOwnableModel from "@/domains/framework/data/BaseOwnableModel";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";

export default class ObjectDictionaryEntryPOTO extends BaseOwnableModel {
    public objectDictionaryEntryId: string = '';
    public name: string = '';
    public description: string = '';
    public objectDictionaryId: string = '';
    public objectDictionary: ObjectDictionaryPOTO = new ObjectDictionaryPOTO();
    public structure: any = {};
}