<template>
  <v-bottom-sheet inset persistent v-model="isSheetOpen">
    <v-sheet>
      <v-container class="px-10 py-10">
        <v-row v-if="isLoading" class="mb-5">
          <v-progress-linear indeterminate></v-progress-linear>
        </v-row>
        <v-row class="mb-5 align-baseline">
          <h2>New Application</h2>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="isLoading"
              text
              color="red"
              @click="cancelAppCreation"
          >close
          </v-btn>
        </v-row>
        <v-form>
          <v-row class="mb-3">
            <v-text-field
                disabled
                :value="newApplication.project ? newApplication.project.name : ''"
                label="Project Name"
                persistent-hint
                hint="This is the project this application will belong to."
                outlined
                dense
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
                :disabled="isLoading"
                v-model="newApplication.name"
                label="Application Name"
                outlined
                dense
            ></v-text-field>
          </v-row>
          <v-row>
            <v-checkbox :disabled="isLoading" class="mx-auto" v-model="newApplication.isPubliclyVisible"
                        label="This application is publicly visible to everyone with its URL"></v-checkbox>
          </v-row>
          <v-row class="mb-3">
            <v-spacer></v-spacer>
            <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                text
                color="success"
                @click="confirmAppCreation"
            >CREATE APP
            </v-btn>
          </v-row>
          <v-row class="mb-16 justify-center">
            <v-alert dense outlined type="success" v-if="isDoneCreating">
              {{ successMessage }}
            </v-alert>
            <v-alert dense type="error" v-if="hasError">
              {{ errorMessage }}
            </v-alert>
          </v-row>
        </v-form>
      </v-container>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";
import {Intent, IntentResult} from "@/store/modules/Intents";
import ApplicationAPI from "@/domains/application/ApplicationAPI";
import {AxiosError, AxiosResponse} from "axios";
import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";

@Component
export default class AppCreator extends Vue {

  isSheetOpen: boolean = true;
  isLoading: boolean = false;

  successMessage: string = "";
  isDoneCreating: boolean = false;

  hasError: boolean = false;
  errorMessage: string = "";

  newApplication: ApplicationPOTO = new ApplicationPOTO();

  constructor() {
    super();
    this.newApplication.name = "";
    this.newApplication.isPubliclyVisible = false;
  }

  mounted() {
    const newAppIntent: Intent<ApplicationPOTO> = this.$store.state.appIntents.newApplicationIntent;
    this.newApplication = newAppIntent.payload;
  }

  cancelAppCreation() {
    this.isSheetOpen = false;
    setTimeout(() => {
      this.$store.dispatch("appIntents/resolveNewApplicationIntent", IntentResult.INTENT_CANCELLED)
    }, 250)
  }

  confirmAppCreation() {
    this.isLoading = true;
    this.hasError = false;
    this.newApplication.projectId = this.newApplication.project.projectId;
    new ApplicationAPI().createApp(this.newApplication)
        .then((response: AxiosResponse<ApplicationPOTO>) => {
          this.successMessage = `Nice! You just created the ${response.data.name} app! I shall lead you to the application page now 🎇`;
          this.isDoneCreating = true;
          setTimeout(() => {
            this.$router.replace('/project/' + response.data.projectId + "/application/" + response.data.applicationId);
            this.finishAppCreation();
          }, 3000);
        })
        .catch((error: AxiosError) => {
          let message: string;
          try {
            const exception = DefaultHTTPException.fromAxiosError(error);
            message = exception.message;
          } catch (e) {
            message = e;
          }
          this.errorMessage = message;
        })
        .finally(() => {
          this.isLoading = false;
        })
  }

  finishAppCreation() {
    this.isSheetOpen = false;
    setTimeout(() => {
      this.$store.dispatch("appIntents/resolveNewApplicationIntent", IntentResult.INTENT_SUCCESS)
    }, 250)
  }

}
</script>

<style scoped>

</style>