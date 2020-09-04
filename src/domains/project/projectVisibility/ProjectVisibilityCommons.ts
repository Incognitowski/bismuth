import ProjectPOTO from "@/domains/project/ProjectPOTO";
import {ProjectVisibilityEnum} from "@/domains/project/projectVisibility/ProjectVisibilityEnum";
import ProjectVisibilityConstants from "@/domains/project/projectVisibility/ProjectVisibilityConstants";
import ProjectVisibilityPOTO from "@/domains/project/projectVisibility/ProjectVisibilityPOTO";

export default class ProjectVisibilityCommons {

    public static getVisibilityFromPOTO(projectVisibility: ProjectVisibilityPOTO): ProjectVisibilityEnum {
        return this.getVisibilityFrom(<string>projectVisibility?.visibility);
    }

    public static getVisibilityFromProject(project: ProjectPOTO): ProjectVisibilityEnum {
        return this.getVisibilityFrom(<string>project?.relationShipWithCurrentUser?.visibility);
    }

    public static getVisibilityFrom(visibilityString: string): ProjectVisibilityEnum {
        switch (visibilityString) {
            case ProjectVisibilityConstants.OWNER:
                return ProjectVisibilityEnum.OWNER;
            case ProjectVisibilityConstants.MANAGER:
                return ProjectVisibilityEnum.MANAGER;
            case ProjectVisibilityConstants.DEVELOPER:
                return ProjectVisibilityEnum.DEVELOPER;
            case ProjectVisibilityConstants.STAKEHOLDER:
                return ProjectVisibilityEnum.STAKEHOLDER;
            default:
                return ProjectVisibilityEnum.NONE;
        }
    }

    public static getReadableVisibilityFrom(visibility: string) {
        let visibilityEnum: ProjectVisibilityEnum = this.getVisibilityFrom(visibility);
        switch (visibilityEnum) {
            case ProjectVisibilityEnum.NONE:
                return "None";
            case ProjectVisibilityEnum.OWNER:
                return "Owner";
            case ProjectVisibilityEnum.MANAGER:
                return "Manager";
            case ProjectVisibilityEnum.DEVELOPER:
                return "Developer";
            case ProjectVisibilityEnum.STAKEHOLDER:
                return "Stakeholder";
        }
    }

}