import {Module} from "vuex";
import {RootState} from "@/store";

export interface AppState {
    isGloballyLoading: boolean,
    jwt?: string,
}

export const AppStateStore: Module<AppState, RootState> = {
    namespaced: true,
    state : {
        isGloballyLoading: true,
    },
    mutations: {
        setGlobalLoadingState(state, shouldLoad: boolean) {
            state.isGloballyLoading = shouldLoad;
        },
        setJWT(state, jwt: string) {
            state.jwt = jwt;
        }
    },
    actions: {
        setGlobalLoadingState(context, shouldLoad: boolean) {
            context.commit('setGlobalLoadingState', shouldLoad);
        },
        setJWT(context, jwt: string) {
            context.commit('setJWT', jwt);
        }
    },
}