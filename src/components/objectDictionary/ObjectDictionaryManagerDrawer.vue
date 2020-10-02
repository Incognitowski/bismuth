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
    <v-container v-if="!isLoading && objectDictionary != null">
      <v-row no-gutters justify="space-between" align="center">
        <h4 class="font-weight-light">
          <v-icon x-small class="mr-2">
            fas fa-project-diagram
          </v-icon>
          <b>{{ objectDictionary.name }}</b>
          <span class="text--secondary text-caption ml-1">Object Dictionary</span>
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
      <v-row v-if="objectDictionary != null" justify="center" align="start">
        <ObjectDictionaryManager :read-only="false" :object-dictionary-id="objectDictionary.objectDictionaryId"/>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import ObjectDictionaryPOTO from "../../domains/artifacts/objectDictionary/ObjectDictionaryPOTO";
import {Intent, IntentResult} from "@/store/modules/Intents";
import ObjectDictionaryManager from "@/components/objectDictionary/ObjectDictionaryManager.vue";
@Component({
  components: {ObjectDictionaryManager}
})
export default class ObjectDictionaryManagerDrawer extends Vue {

  isDrawerOpen: boolean = false;
  isLoading: boolean = false;

  objectDictionary: ObjectDictionaryPOTO | null = null;

  mounted() {
    setTimeout(() => {
      this.isDrawerOpen = true;
    }, 150);
    const intent: Intent<ObjectDictionaryPOTO> = this.$store.state.appIntents.editObjectDictionaryIntent;
    this.objectDictionary = intent.payload;
    this.isLoading = false;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    setTimeout(() => {
      this.$store.dispatch("appIntents/resolveEditObjectDictionaryIntent", IntentResult.INTENT_CANCELLED);
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