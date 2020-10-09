import Argumentable from "@/domains/artifacts/objectDictionary/Argumentable";

export default class ClassMethod extends Argumentable {
    public description: string = '';
    public name: string = '';
    public isStatic: boolean = false;
    public visibility: string = "Public";
    public returnType: String = "Void";
}