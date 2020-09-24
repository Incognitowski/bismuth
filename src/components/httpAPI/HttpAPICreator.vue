<template>
  <v-bottom-sheet inset persistent v-model="isSheetOpen">
    <v-sheet>
      <v-container class="px-10 py-10">
        <v-row v-if="isLoading" class="mb-5">
          <v-progress-linear indeterminate/>
        </v-row>
        <v-row align="center" class="mb-5">
          <v-icon small class="mr-5">
            fas fa-hashtag
          </v-icon>
          <h2>New HTTP API</h2>
          <v-spacer/>
          <v-btn
              :disabled="isLoading || isDoneCreating"
              text
              color="red"
              @click="cancelHttpAPICreation"
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
                hint="This is the application this HTTP API will belong to."
                outlined
                dense
            />
          </v-row>
          <v-row>
            <v-text-field
                :disabled="isLoading || isDoneCreating"
                v-model="newHttpAPI.name"
                label="HTTP API Name"
                outlined
                dense
            />
          </v-row>
          <v-row>
            <v-checkbox
                :disabled="isLoading || isDoneCreating"
                class="mx-auto"
                v-model="newHttpAPI.isPubliclyVisible"
                label="This HTTP API is publicly visible to everyone with its URL"
            />
          </v-row>
          <v-row class="mb-3">
            <v-spacer/>
            <v-btn
                :loading="isLoading"
                :disabled="isLoading || isDoneCreating"
                text
                color="success"
                @click="confirmCreation"
            >CREATE HTTP API
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
import ObjectDictionaryAPI from "@/domains/artifacts/objectDictionary/ObjectDictionaryAPI";
import {AxiosError, AxiosResponse} from "axios";
import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";
import HttpAPIPOTO from "@/domains/artifacts/httpAPI/HttpAPIPOTO";
import HttpAPIAPI from "@/domains/artifacts/httpAPI/HttpAPIAPI";
import ExceptionCommons from "@/domains/framework/ExceptionCommons";

@Component
export default class HttpAPICreator extends Vue {

  isSheetOpen: boolean = true;
  isLoading: boolean = true;
  hasError: boolean = false;
  isDoneCreating: boolean = false;

  successMessage: string = "";
  errorMessage: string = "";

  currentApplication: ApplicationPOTO | null = null;
  newHttpAPI: HttpAPIPOTO = new HttpAPIPOTO();

  mounted() {
    const newHTTPAPIIntent: Intent<ApplicationPOTO> = this.$store.state.appIntents.newHttpAPIIntent;
    this.currentApplication = newHTTPAPIIntent.payload;
    this.isLoading = false;
  }

  confirmCreation() {
    this.isLoading = true;
    this.hasError = false;
    new HttpAPIAPI().create(
        <string>this.currentApplication?.project.projectId,
        <string>this.currentApplication?.applicationId,
        this.newHttpAPI
    ).then((response: AxiosResponse<HttpAPIPOTO>) => {
      this.isDoneCreating = true;
      this.successMessage = "You just created the " + this.newHttpAPI.name + " HTTP API. You will be redirected...";
      setTimeout(() => {
        this.$store.dispatch("appIntents/resolveNewHttpAPIIntent", IntentResult.INTENT_SUCCESS);
      }, 2000);
    }).catch((error: AxiosError) => {
      this.hasError = true;
      this.errorMessage = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  cancelHttpAPICreation() {
    this.isSheetOpen = false;
    setTimeout(() => {
      this.$store.dispatch("appIntents/resolveNewHttpAPIIntent", IntentResult.INTENT_CANCELLED);
    }, 250);
  }

}

</script>

<style scoped>

</style>