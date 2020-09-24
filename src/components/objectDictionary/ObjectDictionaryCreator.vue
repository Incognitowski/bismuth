<template>
  <v-bottom-sheet inset persistent v-model="isSheetOpen">
    <v-sheet>
      <v-container class="px-10 py-10">
        <v-row v-if="isLoading" class="mb-5">
          <v-progress-linear indeterminate/>
        </v-row>
        <v-row align="center" class="mb-5">
          <v-icon small class="mr-5">
            fas fa-project-diagram
          </v-icon>
          <h2>New Object Dictionary</h2>
          <v-spacer/>
          <v-btn
              :disabled="isLoading"
              text
              color="red"
              @click="cancelObjectDictionaryCreation"
          >close
          </v-btn>
        </v-row>
        <v-form>
          <v-row class="mb-3">
            <v-text-field
                disabled
                :value="currentApplication ? currentApplication.name : ''"
                label="Application Name"
                persistent-hint
                hint="This is the application this object dictionary will belong to."
                outlined
                dense
            />
          </v-row>
          <v-row>
            <v-text-field
                :disabled="isLoading"
                v-model="newObjectDictionary.name"
                label="Object Dictionary Name"
                outlined
                dense
            />
          </v-row>
          <v-row>
            <v-checkbox
                :disabled="isLoading"
                class="mx-auto"
                v-model="newObjectDictionary.isPubliclyVisible"
                label="This Object Dictionary is publicly visible to everyone with its URL"
            />
          </v-row>
          <v-row class="mb-3">
            <v-spacer/>
            <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                text
                color="success"
                @click="confirmCreation"
            >CREATE DICTIONARY
            </v-btn>
          </v-row>
          <v-row class="mb-16 justify-center">
            <v-alert dense outlined type="success" v-if="isDoneCreating" v-text="successMessage"/>
            <v-alert dense type="error" v-if="hasError" v-text="errorMessage"/>
          </v-row>
        </v-form>
      </v-container>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import ApplicationPOTO from "../../domains/application/ApplicationPOTO";
import {Intent, IntentResult} from "@/store/modules/Intents";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";

@Component
export default class ObjectDictionaryCreator extends Vue {

  isBootstrapping: boolean = true;
  isSheetOpen: boolean = true;
  isLoading: boolean = true;
  hasError: boolean = false;
  isDoneCreating: boolean = false;

  successMessage: string = "";
  errorMessage: string = "";

  currentApplication: ApplicationPOTO | null = null;
  newObjectDictionary: ObjectDictionaryPOTO = new ObjectDictionaryPOTO();

  mounted() {
    const newObjectDictionaryIntent: Intent<ApplicationPOTO> = this.$store.state.appIntents.newObjectDictionaryIntent;
    this.currentApplication = newObjectDictionaryIntent.payload;
    this.isLoading = false;
  }

  confirmCreation() {
    //TODO
  }

  cancelObjectDictionaryCreation() {
    this.isSheetOpen = false;
    setTimeout(() => {
      this.$store.dispatch("appIntents/resolveNewObjectDictionaryIntent", IntentResult.INTENT_CANCELLED);
    }, 250);
  }

}

</script>

<style scoped>

</style>