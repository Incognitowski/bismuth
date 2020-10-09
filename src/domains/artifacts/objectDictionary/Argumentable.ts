import PropertyType from "@/domains/artifacts/objectDictionary/PropertyType";

export default abstract class Argumentable {
    public arguments: Array<PropertyType> = [];
}