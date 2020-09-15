<template>
  <v-dialog overlay-color="#000000" v-model="isDialogOpen" persistent max-width="750">
    <v-card :loading="isLoading">
      <v-card-title class="headline">You are about to transfer your project</v-card-title>
      <v-card-text>
        <p class="mt-3 mb-5">
          You'll not be removed from this project once you are the owner.
          You will be demoted to manager and the owner must remove you from it if necessary
        </p>
        <v-text-field
            class="my-3"
            label="User's e-mail"
            hint="The e-mail of the user you wish to transfer this project to."
            persistent-hint
            dense
            :disabled="isLoading"
            v-model="userEmail"
            :error-messages="emailErrors"
            :error="emailErrors.length > 0"
            @blur="validateEmail"
            outlined
        ></v-text-field>
        <p class="mt-3 mb-5">
          Confirm the name of the project <b>{{ projectToTransfer ? projectToTransfer.name : "" }}</b>
        </p>
        <v-text-field
            class="my-3"
            label="Project Name"
            dense
            :disabled="isLoading"
            v-model="projectName"
            :error-messages="projectNameErrors"
            :error="projectNameErrors.length > 0"
            @blur="validateProjectName"
            outlined
        ></v-text-field>
        <v-alert v-model="hasError" type="error">
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <p v-if="!isActionAvailable" class="my-auto mr-3 text-caption text--secondary">
          The action will be available in {{ remainingSeconds }} seconds...
        </p>
        <v-btn v-if="isActionAvailable" :disabled="isLoading || emailErrors.length > 0 || projectNameErrors.length > 0" class="mr-3" color="green darken-1" text @click="confirmTransfer">CONFIRM
          TRANSFERENCE
        </v-btn>
        <v-btn :disabled="isLoading" class="mr-3" color="red darken-1" text @click="cancelTransfer">CANCEL</v-btn>
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
export default class ProjectOwnershipTransferCard extends Vue {

  isDialogOpen: boolean = true;
  isLoading: boolean = false;

  hasError: boolean = false;
  errorMessage: string = "";

  remainingSeconds: number = 10;
  isActionAvailable: boolean = false;

  userEmail: string = "";
  emailErrors: Array<string> = [];

  projectName : string = "";
  projectNameErrors : Array<string> = [];

  projectToTransfer: ProjectPOTO | null = null;

  mounted() {
    const projectTransferIntent: Intent<ProjectPOTO> = this.$store.state.appIntents.projectTransferIntent;
    this.projectToTransfer = new ProjectPOTO();
    Object.assign(this.projectToTransfer, projectTransferIntent.payload);
    this.startCountdown();
  }

  validateEmail() {
    this.emailErrors = [];
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(this.userEmail).toLowerCase())) {
      this.emailErrors.push("Invalid e-mail.")
    }
  }

  validateProjectName() {
    this.projectNameErrors = [];
    if(this.projectToTransfer?.name != this.projectName){
      this.projectNameErrors.push("You typed the wrong project name.")
    }
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

  confirmTransfer() {
    this.isLoading = true;
    this.hasError = false;
    let projectTransferPOTO = new ProjectTransferPOTO(this.userEmail, this.projectName);
    new ProjectAPI().transferProject(projectTransferPOTO, <ProjectPOTO>this.projectToTransfer).then((result : AxiosResponse) => {
      this.isDialogOpen = false;
      setTimeout(() => {
        this.$store.dispatch("appIntents/resolveProjectTransferIntent", IntentResult.INTENT_SUCCESS);
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

  cancelTransfer() {
    this.isDialogOpen = false;
    setTimeout(() => {
      this.$store.dispatch("appIntents/resolveProjectTransferIntent", IntentResult.INTENT_CANCELLED);
    }, 250)
  }

}
</script>

<style scoped>

</style>