<template>
  <v-container fluid class="mx-5">

    <v-row v-if="isBootstrapping" justify="space-between">
      <v-progress-circular indeterminate/>
    </v-row>

    <v-row class="mr-5" v-if="!isBootstrapping" justify="space-between" align="baseline">
      <h3 class="font-weight-light">Application <b>{{ currentApplication.name }}</b></h3>
      <h5 class="font-weight-thin">Since {{ parseProjectCreationDate(currentApplication.createdAt) }}</h5>
    </v-row>

    <v-row class="mr-5 my-1 " v-if="!isBootstrapping" justify="space-between" align="baseline">
      <v-divider/>
    </v-row>

    <v-row class="mr-5" v-if="!isBootstrapping" justify="space-between" align="baseline">
      <h5 class="font-weight-light text--secondary">Created by {{ currentApplication.createdBy.username }}. Owned by
        {{ currentApplication.ownedBy.username }}</h5>
      <v-btn small text color="accent">
        SETTINGS
      </v-btn>
    </v-row>

    <v-row class="mr-5 mt-5" v-if="!isBootstrapping" justify="space-between" align="center">
      <h2 class="font-weight-light">Artifacts</h2>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              small
              text
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
          >
            New Artifact
            <v-icon x-small right>fa fa-plus</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              v-for="(item, index) in documentationTypes"
              :key="index"
              @click="openNewArtifactIntent(item)"
          >
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>

    <v-row class="mr-5 mt-1" v-if="!isBootstrapping" justify="space-between" align="baseline">
      <v-divider/>
    </v-row>

    <v-row class="mr-5" v-if="!isBootstrapping" align="start">
      <v-col class="pl-0" cols="4">
        <v-list shaped color="#00000000" dense>
          <v-subheader class="text-center">
            Documentation Types
          </v-subheader>
          <v-list-item-group v-model="selectedDocumentationType" color="primary">
            <v-list-item
                v-for="documentationType in documentationTypes"
                :key="documentationType.type"
                @click="loadDocumentsOfType(documentationType)"
            >
              <v-list-item-icon>
                <v-icon small v-text="documentationType.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="documentationType.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>

      <v-col class="pl-0" cols="5" v-if="selectedDocumentationType != null">
        <v-row justify="center" v-if="isLoadingArtifacts">
          <v-progress-circular indeterminate/>
        </v-row>
        <v-row justify="center" v-if="!isLoadingArtifacts && (loadedObjectDictionaries.length === 0)">
          <p class="font-weight-light text--secondary mt-5 ml-3">No artifact found of this type on this application.</p>
        </v-row>
        <v-list
            dense
            shaped
            color="#00000000"
            v-if="!isLoadingArtifacts && loadedObjectDictionaries.length > 0"
        >
          <v-subheader class="text-center">
            Object Dictionaries
          </v-subheader>
          <v-list-item-group color="primary">
            <v-list-item
                v-for="objectDictionary in loadedObjectDictionaries"
                :key="objectDictionary.objectDictionaryId"
            >
              <v-list-item-content>
                <v-list-item-title v-text="objectDictionary.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>

    </v-row>

    <v-snackbar :timeout="5000" v-model="showSnackbar">
      {{ snackBarText }}
    </v-snackbar>
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

@Component
export default class ApplicationScreen extends Vue {

  currentProject: ProjectPOTO | null = null;
  currentApplication: ApplicationPOTO | null = null;
  isBootstrapping: boolean = true;
  isLoading: boolean = false;
  isLoadingArtifacts: boolean = false;

  showSnackbar: boolean = false;
  snackBarText: string = "";

  selectedDocumentationType: DocumentationTypeHolder | null = null;
  // DO NOT CHANGE THE ORDER OF THIS LIST, FOR THE LOVE OF GOD
  documentationTypes: Array<DocumentationTypeHolder> = [
    {text: 'Text Document', icon: 'fas fa-book-open', type: ArtifactTypes.TEXT_DOCUMENT},
    {text: 'Object Dictionary', icon: 'fas fa-project-diagram', type: ArtifactTypes.OBJECT_DICTIONARY},
    {text: 'HTTP API', icon: 'fas fa-hashtag', type: ArtifactTypes.HTTP_API},
  ];

  loadedObjectDictionaries: Array<ObjectDictionaryPOTO> = [];

  mounted() {
    if (this.$store.state.project.selectedProject == null) {
      this.searchForProject();
    } else {
      this.currentProject = this.$store.state.project.selectedProject;
      if (this.$store.state.application.selectedApplication == null) {
        this.searchForApplication();
      } else {
        this.currentApplication = this.$store.state.application.selectedApplication;
        this.isBootstrapping = false;
        this.isLoading = false;
      }
    }
  }

  parseProjectCreationDate(date: number): string {
    return DateCommons.parseDate(date);
  }

  private searchForProject() {
    new ProjectAPI().getById(this.$route.params.projectId).then((response: AxiosResponse<ProjectPOTO>) => {
      this.currentProject = response.data;
      this.$store.dispatch("project/setSelectedProject", this.currentProject);
      this.searchForApplication();
    }).catch((error: AxiosError) => {
      this.showSnackbar = true;
      this.snackBarText = error.message;
    })
  }

  private searchForApplication() {
    new ApplicationAPI().getApplication(
        <string>this.currentProject?.projectId,
        this.$route.params.applicationId
    ).then((response: AxiosResponse<ApplicationPOTO>) => {
      this.currentApplication = response.data;
      this.$store.dispatch("application/setSelectedApplication", this.currentApplication);
      this.isLoading = false;
      this.isBootstrapping = false;
    }).catch((error: AxiosError) => {
      this.showSnackbar = true;
      this.snackBarText = error.message;
    });
  }


  openNewArtifactIntent(type: DocumentationTypeHolder) {
    switch (type.type) {
      case ArtifactTypes.OBJECT_DICTIONARY:
        this.openObjectDictionaryArtifactCreator();
        break;
        //todo ArtifactTypes.TEXT_DOCUMENT
        //todo ArtifactTypes.HTTP_API
    }
  }

  loadDocumentsOfType(type: DocumentationTypeHolder) {
    this.loadedObjectDictionaries = [];
    switch (type.type) {
      case ArtifactTypes.OBJECT_DICTIONARY:
        this.selectedDocumentationType = type;
        this.loadObjectDictionaryArtifacts();
        break;
        //todo ArtifactTypes.TEXT_DOCUMENT
        //todo ArtifactTypes.HTTP_API
    }
  }

  openObjectDictionaryArtifactCreator() {
    const newObjectDictionaryArtifactIntent: Intent<ApplicationPOTO> = {
      action: IntentAction.NEW_OBJECT_DICTIONARY_ARTIFACT,
      payload: <ApplicationPOTO>this.currentApplication,
      callback: {
        action: (result: IntentResult) => {
          if (result == IntentResult.INTENT_SUCCESS) {
            this.loadDocumentsOfType(this.documentationTypes[1]);
          }
        }
      }
    }
    this.$store.dispatch("appIntents/setNewObjectDictionaryIntent", newObjectDictionaryArtifactIntent);
  }

  private loadObjectDictionaryArtifacts() {
    this.isLoadingArtifacts = true;
    new ObjectDictionaryAPI().getObjectDictionariesInApp(
        <string>this.currentProject?.projectId,
        <string>this.currentApplication?.applicationId
    ).then((response: AxiosResponse<Array<ObjectDictionaryPOTO>>) => {
      this.loadedObjectDictionaries = response.data;
    }).catch((error: AxiosError) => {
      this.showSnackbar = true;
      this.snackBarText = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoadingArtifacts = false;
    })
  }
}

</script>