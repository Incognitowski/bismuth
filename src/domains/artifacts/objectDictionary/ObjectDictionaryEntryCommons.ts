import ClassMethod from "@/domains/artifacts/objectDictionary/ClassMethod";
import ClassConstructor from "@/domains/artifacts/objectDictionary/ClassConstructor";
import ClassProperty from "@/domains/artifacts/objectDictionary/ClassProperty";
import PropertyType from "@/domains/artifacts/objectDictionary/PropertyType";

export default class ObjectDictionaryEntryCommons {

    static getConstructorLabel(constructor: ClassConstructor, dictionaryEntryName: string): string {
        let label: string = constructor.visibility + " " + dictionaryEntryName + "(";
        label += this.getArgumentsString(constructor.arguments);
        label += ")";
        return label;
    }

    static getMethodLabel(method: ClassMethod): string {
        let label: string = "";
        label += method.visibility + " ";
        if (method.isStatic) {
            label += "static ";
        }
        label += method.name + "(";
        label += this.getArgumentsString(method.arguments);
        label += ")";
        if (method.returnType != "Void")
            label += " : " + method.returnType;
        return label;
    }

    static getPropertyLabel(property: ClassProperty): string {
        let label: string = "";
        label += property.visibility + " ";
        if (property.isStatic) {
            label += "static ";
        }
        if (property.isFinal) {
            label += "final ";
        }
        label += property.name;
        label += " : " + property.type;
        return label;
    }

    static getArgumentsString(argumentList: Array<PropertyType>) {
        let argumentsString: string = "";
        argumentList.map((value, index) => {
            argumentsString += value.label + " : ";
            if (value.isNullable) {
                argumentsString += " Nullable ";
            }
            if (value.isArray) {
                argumentsString += "Array<" + value.type + ">"
            } else {
                argumentsString += value.type
            }
            if (index != argumentList.length - 1) {
                argumentsString += ", ";
            }
        })
        return argumentsString;
    }

}