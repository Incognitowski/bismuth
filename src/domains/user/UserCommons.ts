import AutocompleteObjectHolder from "@/domains/framework/autocomplete/AutocompleteObjectHolder";
import UserPOTO from "@/domains/user/UserPOTO";

export default class UserCommons {

    public static getUsersForAutocomplete(users: Array<UserPOTO>): Array<AutocompleteObjectHolder<UserPOTO>> {
        const autocompleteHolders = new Array<AutocompleteObjectHolder<UserPOTO>>();
        users.map((value, index) => {
            let autocompleteObjectHolder = new AutocompleteObjectHolder<UserPOTO>();
            autocompleteObjectHolder.value = value;
            autocompleteObjectHolder.text = <string>value.username;
            autocompleteHolders.push(autocompleteObjectHolder);
        })
        return autocompleteHolders;
    }

}