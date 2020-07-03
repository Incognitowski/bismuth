import Vue from 'vue'
import Vuex from 'vuex'
import {AppStateStore} from "@/store/modules/AppState";

Vue.use(Vuex)

export interface RootState {
}

export default new Vuex.Store({
    state: {
    },
    modules: {
        appState: AppStateStore
    }
})
