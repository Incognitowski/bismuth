import ClassConstructor from "@/domains/artifacts/objectDictionary/ClassConstructor";
import ClassMethod from "@/domains/artifacts/objectDictionary/ClassMethod";
import ClassProperty from "@/domains/artifacts/objectDictionary/ClassProperty";

export default class ClassStructure {
    entryConstructors: Array<ClassConstructor> = new Array<ClassConstructor>();
    entryMethods: Array<ClassMethod> = new Array<ClassMethod>();
    entryProperties: Array<ClassProperty> = new Array<ClassProperty>();
}