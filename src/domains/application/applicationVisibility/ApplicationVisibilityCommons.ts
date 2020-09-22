import ProjectPOTO from "@/domains/project/ProjectPOTO";
import ApplicationVisibilityPOTO from "@/domains/application/applicationVisibility/ApplicationVisibilityPOTO";
import {ApplicationVisibilityEnum} from "@/domains/application/applicationVisibility/ApplicationVisibilityEnum";
import ApplicationVisibilityConstants from "@/domains/application/applicationVisibility/ApplicationVisibilityConstants";

export default class ApplicationVisibilityCommons {

    public static getVisibilityFromPOTO(visibility: ApplicationVisibilityPOTO): ApplicationVisibilityEnum {
        return this.getVisibilityFrom(<string>visibility?.visibility);
    }

    public static getVisibilityFromProject(project: ProjectPOTO): ApplicationVisibilityEnum {
        return this.getVisibilityFrom(<string>project?.relationShipWithCurrentUser?.visibility);
    }

    public static getVisibilityFrom(visibilityString: string): ApplicationVisibilityEnum {
        switch (visibilityString) {
            case ApplicationVisibilityConstants.OWNER:
                return ApplicationVisibilityEnum.OWNER;
            case ApplicationVisibilityConstants.MANAGER:
                return ApplicationVisibilityEnum.MANAGER;
            case ApplicationVisibilityConstants.DEVELOPER:
                return ApplicationVisibilityEnum.DEVELOPER;
            case ApplicationVisibilityConstants.STAKEHOLDER:
                return ApplicationVisibilityEnum.STAKEHOLDER;
            default:
                return ApplicationVisibilityEnum.NONE;
        }
    }

    public static getReadableVisibilityFrom(visibility: string) {
        let visibilityEnum: ApplicationVisibilityEnum = this.getVisibilityFrom(visibility);
        switch (visibilityEnum) {
            case ApplicationVisibilityEnum.NONE:
                return "None";
            case ApplicationVisibilityEnum.OWNER:
                return "Owner";
            case ApplicationVisibilityEnum.MANAGER:
                return "Manager";
            case ApplicationVisibilityEnum.DEVELOPER:
                return "Developer";
            case ApplicationVisibilityEnum.STAKEHOLDER:
                return "Stakeholder";
        }
    }

}