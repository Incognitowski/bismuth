import {Module} from "vuex";
import {RootState} from "@/store";
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";

export interface ApplicationStore {
    selectedApplication: ApplicationPOTO | undefined
}

export const ApplicationStoreState: Module<ApplicationStore, RootState> = {
    namespaced: true,
    state: {
        selectedApplication: undefined,
    },
    mutations: {
        setSelectedApplication(state, app: ApplicationPOTO) {
            state.selectedApplication = app;
        },
    },
    actions: {
        setSelectedApplication(context, app: ApplicationPOTO) {
            context.commit('setSelectedApplication', app);
        },
    },
}