<template>
  <v-container>
    <v-card v-if="!tryingToAccessNonPublicObjectDictionary">
      <v-card-title>
        <v-row no-gutters justify="space-between">
          <h2>Object Dictionary <span class="font-weight-light">{{ objectDictionary.name }}</span></h2>
        </v-row>
      </v-card-title>
      <v-card-text>
        <ObjectDictionaryManager :read-only="true" :object-dictionary-id="this.$route.params.objectDictionaryId"/>
      </v-card-text>
    </v-card>
    <v-card v-if="tryingToAccessNonPublicObjectDictionary">
      <!-- todo -->
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";
import ProjectAPI from "@/domains/project/ProjectAPI";
import {AxiosError, AxiosResponse} from "axios";
import ApplicationAPI from "@/domains/application/ApplicationAPI";
import DateCommons from "@/domains/framework/DateCommons";
import {ArtifactTypes} from "@/domains/artifacts/ArtifactTypes";
import DocumentationTypeHolder from "@/domains/artifacts/DocumentationTypeHolder";
import {Intent, IntentAction, IntentResult} from "@/store/modules/Intents";
import ObjectDictionaryAPI from "@/domains/artifacts/objectDictionary/ObjectDictionaryAPI";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";
import ExceptionCommons from "@/domains/framework/ExceptionCommons";
import HttpAPIAPI from "@/domains/artifacts/httpAPI/HttpAPIAPI";
import HttpAPIPOTO from "@/domains/artifacts/httpAPI/HttpAPIPOTO";
import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";
import ObjectDictionaryManager from "@/components/objectDictionary/ObjectDictionaryManager.vue";
@Component({
  components: {ObjectDictionaryManager}
})
export default class ObjectDictionaryPublicScreen extends Vue {

  isLoadingObjectDictionary: boolean = true;
  isLoadingArtifacts: boolean = true;

  tryingToAccessNonPublicObjectDictionary: boolean = false;

  objectDictionary: ObjectDictionaryPOTO = new ObjectDictionaryPOTO();
  objectDictionaryEntries: Array<ObjectDictionaryEntryPOTO> = new Array<ObjectDictionaryEntryPOTO>();

  mounted() {
    this.$store.dispatch("appState/setTopToolbarVisibility", false);
    this.$store.dispatch("appState/setRightToolbarVisibility", false);
    this.$store.dispatch("appState/setLeftToolbarVisibility", false);
    // this.loadObjectDictionary();
  }

  private loadObjectDictionary() {
    this.isLoadingObjectDictionary = true;
    new ObjectDictionaryAPI().getObjectDictionaryPublicly(
        <string>this.$route.params.projectId,
        <string>this.$route.params.applicationId,
        <string>this.$route.params.objectDictionaryId
    ).then((response: AxiosResponse<ObjectDictionaryPOTO>) => {
      this.objectDictionary = response.data;
      this.loadObjectDictionaryEntries();
    }).catch((error: AxiosError) => {
      // todo
    }).finally(() => {
      this.isLoadingObjectDictionary = false;
    });
  }

}

</script>