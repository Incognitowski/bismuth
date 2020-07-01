import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        appState: {
            isGloballyLoading: true,
        }
    },
    mutations: {
        setGlobalLoadingState(state, shouldLoad: boolean) {
            state.appState.isGloballyLoading = shouldLoad;
        }
    },
    actions: {
        setGlobalLoadingState(context, shouldLoad: boolean) {
            context.commit('setGlobalLoadingState', shouldLoad);
        }
    },
    modules: {}
})
