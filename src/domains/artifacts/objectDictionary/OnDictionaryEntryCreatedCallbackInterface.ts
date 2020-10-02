import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";

export default abstract class OnDictionaryEntryCreatedCallbackInterface {
    public abstract onEntryCreated(entry: ObjectDictionaryEntryPOTO) : void;
}