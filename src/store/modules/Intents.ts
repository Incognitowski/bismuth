import {Module} from "vuex";
import {RootState} from "@/store";

export enum IntentAction {
    NEW_PROJECT
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
    newProjectIntent: Intent<null> | null,
}

export const AppIntentsState: Module<IntentsState, RootState> = {
    namespaced: true,
    state: {
        newProjectIntent: null,
    },
    mutations: {
        setNewProjectIntent(state, intent: Intent<null>) {
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
        }
    },
    actions: {
        setGlobalLoadingState(context, shouldLoad: boolean) {
            context.commit('setGlobalLoadingState', shouldLoad);
        },
        setNewProjectIntent(context, intent: Intent<null>) {
            context.commit("setNewProjectIntent", intent)
        },
        resolveNewProjectIntent(context, result: IntentResult) {
            context.commit("resolveNewProjectIntent", result);
            context.commit("clearNewProjectIntent");
        },
        clearNewProjectIntent(context) {
            context.commit("clearNewProjectIntent")
        }
    },
}