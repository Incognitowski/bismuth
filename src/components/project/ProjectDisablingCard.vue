<template>
  <v-dialog overlay-color="#000000" v-model="isDialogOpen" persistent max-width="750">
    <v-card :loading="isLoading">
      <v-card-title class="headline">You are about to disable your project</v-card-title>
      <v-card-text>
        <p class="mt-3 mb-5">
          This project and all it's applications will become inaccessible to every user related to it.
        </p>
        <p class="mt-3 mb-5">
          Would you like to proceed?
        </p>
        <v-alert v-model="hasError" type="error">
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <p v-if="!isActionAvailable" class="my-auto mr-3 text-caption text--secondary">
          The action will be available in {{ remainingSeconds }} seconds...
        </p>
        <v-btn v-if="isActionAvailable" :disabled="isLoading" class="mr-3" color="green darken-1" text @click="confirmDisable">CONFIRM
          TRANSFERENCE
        </v-btn>
        <v-btn :disabled="isLoading" class="mr-3" color="red darken-1" text @click="cancelDisable">CANCEL</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Intent, IntentResult} from "@/store/modules/Intents";
import ProjectPOTO from "../../domains/project/ProjectPOTO";
import ProjectAPI from "@/domains/project/ProjectAPI";
import ProjectTransferPOTO from "@/domains/project/ProjectTransferPOTO";
import {AxiosError, AxiosResponse} from "axios";
import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";

@Component
export default class ProjectDisablingCard extends Vue {

  isDialogOpen: boolean = true;
  isLoading: boolean = false;

  hasError: boolean = false;
  errorMessage: string = "";

  remainingSeconds: number = 10;
  isActionAvailable: boolean = false;

  projectToDisable: ProjectPOTO | null = null;

  mounted() {
    const projectDisableIntent: Intent<ProjectPOTO> = this.$store.state.appIntents.projectDisableIntent;
    this.projectToDisable = new ProjectPOTO();
    Object.assign(this.projectToDisable, projectDisableIntent.payload);
    this.startCountdown();
  }

  startCountdown() {
    let timer = setInterval(() => {
      this.remainingSeconds = this.remainingSeconds - 1;
      if (this.remainingSeconds == 0) {
        this.isActionAvailable = true;
        clearInterval(timer);
      }
    }, 1000);
  }

  confirmDisable() {
    this.isLoading = true;
    this.hasError = false;
    new ProjectAPI().disableProject(this.projectToDisable).then((result : AxiosResponse) => {
      this.isDialogOpen = false;
      setTimeout(() => {
        this.$store.dispatch("appIntents/resolveProjectDisableIntent", IntentResult.INTENT_SUCCESS);
      }, 250)
    }).catch((error : AxiosError) => {
      let message: string;
      try {
        const exception = DefaultHTTPException.fromAxiosError(error);
        message = exception.message;
      } catch (e) {
        message = e;
      }
      this.errorMessage = message;
      this.hasError = true;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  cancelDisable() {
    this.isDialogOpen = false;
    setTimeout(() => {
      this.$store.dispatch("appIntents/resolveProjectDisableIntent", IntentResult.INTENT_CANCELLED);
    }, 250)
  }

}
</script>

<style scoped>

</style>