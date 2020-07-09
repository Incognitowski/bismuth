import AutocompleteObjectHolder from "@/domains/framework/autocomplete/AutocompleteObjectHolder";
import ProjectPOTO from "@/domains/project/ProjectPOTO";

export default class ProjectCommons {

    public static getProjectsForAutocomplete(projects: Array<ProjectPOTO>): Array<AutocompleteObjectHolder<ProjectPOTO>> {
        const autocompleteHolders = new Array<AutocompleteObjectHolder<ProjectPOTO>>();
        projects.map((value) => {
            let autocompleteObjectHolder = new AutocompleteObjectHolder<ProjectPOTO>();
            autocompleteObjectHolder.value = value;
            autocompleteObjectHolder.disabled = !value.active;
            autocompleteObjectHolder.text = value.name;
            autocompleteHolders.push(autocompleteObjectHolder);
        })
        return autocompleteHolders;
    }

}