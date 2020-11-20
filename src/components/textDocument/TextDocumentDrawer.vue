<template>
  <v-navigation-drawer
      v-model="isDrawerOpen"
      absolute
      stateless
      temporary
      class="artifact-drawer-width"
  >
    <v-container fluid v-if="isLoading">
      <v-row class="mt-10" justify="center">
        <v-progress-circular indeterminate/>
      </v-row>
    </v-container>
    <v-container v-if="!isLoading && httpAPI != null">
      <v-row no-gutters justify="space-between" align="center">
        <h4 class="font-weight-light">
          <v-icon x-small class="mr-2">
            fas fa-hashtag
          </v-icon>
          <b>{{ textDocument.name }}</b>
          <span class="text--secondary text-caption ml-1">Text Document</span>
        </h4>
        <v-btn
            text
            small
            color="red"
            @click="closeDrawer"
        >
          CLOSE
        </v-btn>
      </v-row>
      <v-row justify="center" class="mt-2">
        <v-divider/>
      </v-row>
      <v-row v-if="httpAPI != null" justify="center" align="start">
        <TextDocumentManager :read-only="false" :text-document-id="httpAPI.httpApiId"/>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import HttpAPIPOTO from "../../domains/artifacts/httpAPI/HttpAPIPOTO";
import {Intent, IntentResult} from "@/store/modules/Intents";
import HttpAPIManager from "@/components/httpAPI/HttpAPIManager.vue";

@Component({
  components: {HttpAPIManager}
})
export default class HttpAPIManagerDrawer extends Vue {

  isLoading: boolean = false;
  isDrawerOpen: boolean = false;

  textDocument: HttpAPIPOTO | null = null;

  mounted() {
    setTimeout(() => {
      this.isDrawerOpen = true;
    }, 150);
    const intent: Intent<HttpAPIPOTO> = this.$store.state.appIntents.editHttpAPIIntent;
    this.textDocument = intent.payload;
    this.isLoading = false;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    setTimeout(() => {
      this.$store.dispatch("appIntents/resolveEditHttpAPIIntent", IntentResult.INTENT_CANCELLED);
    }, 250);
  }

}
</script>

<style scoped>

.artifact-drawer-width {
  min-width: 800px;
  max-width: 1200px;
  width: calc(100vw - 30vw) !important;
}

</style>