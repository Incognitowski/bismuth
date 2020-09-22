import {Module} from "vuex";
import {RootState} from "@/store";
import ProjectPOTO from "@/domains/project/ProjectPOTO";

export interface ProjectStore {
    selectedProject : ProjectPOTO | undefined
}

export const ProjectStoreState: Module<ProjectStore, RootState> = {
    namespaced: true,
    state: {
        selectedProject: undefined,
    },
    mutations: {
        setSelectedProject(state, project : ProjectPOTO) {
            state.selectedProject = project;
        },
    },
    actions: {
        setSelectedProject(context, project : ProjectPOTO) {
            context.commit('setSelectedProject', project);
        },
    },
}