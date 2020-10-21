<template>
  <v-app style="height: 100vh; max-height: 100vh">
    <BismuthLeftToolbar/>
    <BismuthRightToolbar/>
    <BismuthAppBar/>
    <ActionHolder/>
    <v-main style="max-height: 100vh; height: 100vh">
      <v-container fluid class="main-container-height-fix">
        <AppLoader v-if="isGloballyLoading"></AppLoader>
        <router-view v-if="!isGloballyLoading"/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import AppLoader from "@/components/AppLoader.vue";
import BismuthAppBar from "@/components/BismuthAppBar.vue";
import BismuthLeftToolbar from "@/components/BismuthLeftToolbar.vue";
import BismuthRightToolbar from "@/components/BismuthRightToolbar.vue";
import ActionHolder from "@/components/ActionHolder.vue";
import AuthenticationAPI from "@/domains/authentication/AuthenticationAPI";

import {Intent, IntentAction, IntentCallbackInterface, IntentResult} from '@/store/modules/Intents';
import {AxiosError, AxiosResponse} from "axios";

@Component({
  components: {
    BismuthLeftToolbar,
    BismuthRightToolbar,
    AppLoader,
    BismuthAppBar,
    ActionHolder
  }
})
export default class App extends Vue {

  constructor() {
    super();
  }

  mounted() {
    if (new AuthenticationAPI().isLoggedIn()) {
      this.checkIfTokenIsValid();
    } else {
      this.redirectToLoginIfNotAlready();
      this.$store.dispatch('appState/setGlobalLoadingState', false)
    }
  }

  get isGloballyLoading(): boolean {
    return this.$store.state.appState.isGloballyLoading
  }

  private checkIfTokenIsValid() {
    new AuthenticationAPI().validateJWT().then((result: AxiosResponse) => {
      this.$store.dispatch("appState/setLeftToolbarVisibility", true);
      this.$store.dispatch("appState/setRightToolbarVisibility", true);
      this.$store.dispatch("appState/setTopToolbarVisibility", true);
    }).catch((error: AxiosError) => {
      this.redirectToLoginIfNotAlready();
    }).finally(() => {
      this.$store.dispatch('appState/setGlobalLoadingState', false)
    })
  }

  private redirectToLoginIfNotAlready() {
    if (this.$route.name != 'Login')
      this.$router.replace('/login');
  }

  private redirectToDashboardIfNotAlready() {
    if (this.$route.path == '/')
      this.$router.push('/dashboard');
  }
}
</script>

<style>

::-webkit-scrollbar {
  width: 10px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #292929;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background: #54545400;
}

.main-container-height-fix {
  height: calc(100vh - 48px);
}

</style>
