import {Module} from "vuex";
import {RootState} from "@/store";

export interface AppState {
    isGloballyLoading: boolean,
    isShowingRightToolbar: boolean,
    isShowingLeftToolbar: boolean,
    isShowingTopToolbar: boolean,
    jwt?: string,
}

export const AppStateStore: Module<AppState, RootState> = {
    namespaced: true,
    state: {
        isShowingRightToolbar: false,
        isShowingLeftToolbar: false,
        isShowingTopToolbar: false,
        isGloballyLoading: true,
    },
    mutations: {
        setGlobalLoadingState(state, shouldLoad: boolean) {
            state.isGloballyLoading = shouldLoad;
        },
        setJWT(state, jwt: string) {
            state.jwt = jwt;
        },
        setRightToolbarVisibility(state, visible: boolean) {
            state.isShowingRightToolbar = visible;
        },
        setLeftToolbarVisibility(state, visible: boolean) {
            state.isShowingLeftToolbar = visible;
        },
        setTopToolbarVisibility(state, visible: boolean) {
            state.isShowingTopToolbar = visible;
        },
    },
    actions: {
        setGlobalLoadingState(context, shouldLoad: boolean) {
            context.commit('setGlobalLoadingState', shouldLoad);
        },
        setJWT(context, jwt: string) {
            context.commit('setJWT', jwt);
        },
        setRightToolbarVisibility(context, visible: boolean) {
            context.commit('setRightToolbarVisibility', visible);
        },
        setLeftToolbarVisibility(context, visible: boolean) {
            context.commit('setLeftToolbarVisibility', visible);
        },
        setTopToolbarVisibility(context, visible: boolean) {
            context.commit('setTopToolbarVisibility', visible);
        },
    },
}