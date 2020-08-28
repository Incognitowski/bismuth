import {Module} from "vuex";
import {RootState} from "@/store";
import ProjectPOTO from "@/domains/project/ProjectPOTO";

export enum IntentAction {
    NEW_PROJECT,
    EDIT_PROJECT
}

export enum IntentResult {
    INTENT_CANCELLED,
    INTENT_SUCCESS,
    INTENT_FAILED
}

export interface IntentCallbackInterface {
    action(result: IntentResult): void;
}

export interface Intent<T> {
    action: IntentAction,
    payload: T,
    callback: IntentCallbackInterface
}

export interface IntentsState {
    newProjectIntent: Intent<ProjectPOTO> | null,
    editProjectIntent: Intent<ProjectPOTO> | null,
}

export const AppIntentsState: Module<IntentsState, RootState> = {
    namespaced: true,
    state: {
        newProjectIntent: null,
        editProjectIntent: null,
    },
    mutations: {
        setNewProjectIntent(state, intent: Intent<ProjectPOTO>) {
            state.newProjectIntent = intent;
        },
        resolveNewProjectIntent(state, result: IntentResult) {
            if (state.newProjectIntent) {
                state.newProjectIntent.callback.action(result);
            } else {
                console.warn("ATTEMPT TO CALL .action() on newProjectIntent with empty intent")
            }
        },
        clearNewProjectIntent(state) {
            state.newProjectIntent = null;
        },
        setEditProjectIntent(state, intent: Intent<ProjectPOTO>) {
            state.editProjectIntent = intent;
        },
        resolveEditProjectIntent(state, result: IntentResult) {
            if (state.editProjectIntent) {
                state.editProjectIntent.callback.action(result);
            } else {
                console.warn("ATTEMPT TO CALL .action() on newProjectIntent with empty intent")
            }
        },
        clearEditProjectIntent(state) {
            state.editProjectIntent = null;
        }
    },
    actions: {
        setGlobalLoadingState(context, shouldLoad: boolean) {
            context.commit('setGlobalLoadingState', shouldLoad);
        },
        setNewProjectIntent(context, intent: Intent<ProjectPOTO>) {
            context.commit("setNewProjectIntent", intent)
        },
        resolveNewProjectIntent(context, result: IntentResult) {
            context.commit("resolveNewProjectIntent", result);
            context.commit("clearNewProjectIntent");
        },
        clearNewProjectIntent(context) {
            context.commit("clearNewProjectIntent")
        },
        setEditProjectIntent(context, intent: Intent<ProjectPOTO>) {
            context.commit("setEditProjectIntent", intent)
        },
        resolveEditProjectIntent(context, result: IntentResult) {
            context.commit("resolveEditProjectIntent", result);
            context.commit("clearEditProjectIntent");
        },
        clearEditProjectIntent(context) {
            context.commit("clearEditProjectIntent")
        }
    },
}