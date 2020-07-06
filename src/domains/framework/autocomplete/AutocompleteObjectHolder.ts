export default class AutocompleteObjectHolder<T> {
    public text!: string;
    public value!: T;
    public disabled!: boolean;
    public divider!: boolean;
    public header!: string;
}