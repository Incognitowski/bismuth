<template>
  <v-bottom-sheet overlay-color="#000000" inset persistent v-model="isSheetOpen">
    <v-sheet>
      <v-container class="px-10 py-10">
        <v-row v-if="isLoading" class="mb-5">
          <v-progress-linear indeterminate></v-progress-linear>
        </v-row>
        <v-row class="mb-5 align-baseline">
          <h2>Edit Project</h2>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="isLoading"
              text
              color="red"
              @click="cancelProjectEditing"
          >close
          </v-btn>
        </v-row>
        <v-row class="mb-5">
          <v-tabs
              v-model="tabs"
              center-active
              dark
              centered
              grow
          >
            <v-tab>Basic Information</v-tab>
            <v-tab>Access</v-tab>
          </v-tabs>
        </v-row>
        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <v-form class="mt-10 mb-10">
              <v-row>
                <v-text-field
                    :disabled="isLoading"
                    v-model="projectToEdit.name"
                    label="Project Name"
                    outlined
                    dense
                ></v-text-field>
              </v-row>
              <v-row>
                <v-checkbox :disabled="isLoading" class="mx-auto" v-model="projectToEdit.isPubliclyVisible"
                            label="This project is publicly visible to everyone with its URL"></v-checkbox>
              </v-row>
              <v-row class="mb-10">
                <v-spacer></v-spacer>
                <v-btn
                    :loading="isLoading"
                    :disabled="isLoading"
                    text
                    color="success"
                    @click="saveProjectInformation"
                >SAVE
                </v-btn>
              </v-row>
            </v-form>
          </v-tab-item>
          <v-tab-item>
            <p>teste</p>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-sheet>

    <!-- SNACKBACK -->
    <v-snackbar
        v-model="showSnackBar"
        timeout="5000"
        :color="hasError ? 'red' : 'green'"
    >
      {{ snackBarText }}
    </v-snackbar>
  </v-bottom-sheet>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import {Intent, IntentResult} from "@/store/modules/Intents";
import ProjectAPI from "@/domains/project/ProjectAPI";
import {AxiosError, AxiosResponse} from "axios";
import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";

@Component
export default class ProjectEditor extends Vue {

  changedProjectsProperties = false;

  tabs = null;
  isSheetOpen = true;
  isLoading = false;

  hasError = false;
  errorMessage = "";

  showSnackBar = false;
  snackBarText = "";

  projectToEdit: ProjectPOTO;

  constructor() {
    super();
    this.projectToEdit = new ProjectPOTO();
    this.projectToEdit.isPubliclyVisible = false;
    this.projectToEdit.name = "Loading...";
  }

  mounted() {
    const editProjectIntent: Intent<ProjectPOTO> = this.$store.state.appIntents.editProjectIntent;
    Object.assign(this.projectToEdit, editProjectIntent.payload)
  }

  cancelProjectEditing() {
    this.isSheetOpen = false;
    setTimeout(() => {
      if (this.changedProjectsProperties) {
        this.$store.dispatch("appIntents/resolveEditProjectIntent", IntentResult.INTENT_SUCCESS)
      } else {
        this.$store.dispatch("appIntents/resolveEditProjectIntent", IntentResult.INTENT_CANCELLED)
      }
    }, 250)
  }

  saveProjectInformation() {
    this.isLoading = true;
    this.hasError = false;
    new ProjectAPI().editProject(this.projectToEdit).then((result: AxiosResponse<ProjectPOTO>) => {
      this.snackBarText = "Your new project properties were saved. ✌";
      this.showSnackBar = true;
      this.isLoading = false;
      this.changedProjectsProperties = true;
    }).catch((error: AxiosError) => {
      let message: string;
      try {
        const exception = DefaultHTTPException.fromAxiosError(error);
        message = exception.message;
      } catch (e) {
        message = e;
      }
      this.hasError = true;
      this.isLoading = false;
      this.snackBarText = message;
      this.showSnackBar = true;
    });
  }

}

</script>

<style scoped>

</style>