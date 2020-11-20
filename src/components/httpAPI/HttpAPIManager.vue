<template>
  <v-row no-gutters v-if="!isLoading">
    <v-list shaped width="auto">
      <v-list-item-group v-model="selectedNavigationItem" color="accent">
        <v-list-item
            class="mb-1"
            v-for="item in navigationItems"
            :key="item.type"
            :value="item"
        >
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  v-text="item.icon"
              />
            </template>
            <span>{{ item.label }}</span>
          </v-tooltip>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-col v-if="isInContent">
      <v-container class="px-5">
        <v-row justify="start" align="baseline">
          <h2 class="font-weight-light">HTTP Requests</h2>
          <h4 class="font-weight-thin ml-3" v-if="requestsSearchWord.trim().length > 0">
            with search word "{{ requestsSearchWord.trim() }}"
          </h4>
          <v-tooltip right v-if="currentHttpAPI.isPubliclyVisible">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  class="ml-3"
                  rounded
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="copyPublicUrlToClipboard"
              >
                <v-icon small>fa fa-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy public URL</span>
          </v-tooltip>
          <v-spacer/>
          <v-text-field
              label="Search Requests"
              dense
              style="max-width: 200px"
              outlined
              v-model="requestsSearchWord"
          ></v-text-field>
          <v-tooltip bottom v-if="!isReadOnly">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  class="ml-3"
                  rounded
                  text
                  v-bind="attrs"
                  v-on="on"
                  :disabled="isLoading"
                  @click="openRequestCreator"
              >
                <v-icon small>fa fa-plus</v-icon>
              </v-btn>
            </template>
            <span>New Request</span>
          </v-tooltip>
        </v-row>
        <v-row v-if="isLoadingRequests && !isCreatingRequest && !isEditingRequest" justify="center">
          <v-progress-circular indeterminate/>
        </v-row>
        <v-row v-if="!isLoadingRequests && !isCreatingRequest && !isEditingRequest && loadedRequests.length === 0"
               justify="center">
          There are no requests on this HTTP API yet. Click the plus sign on the upper-right corner to add a new
          request.
        </v-row>

        <v-row v-if="!isLoadingRequests && !isCreatingRequest && !isEditingRequest && loadedRequests.length > 0"
               justify="start" dense>
          <HttpAPIListItem
              v-for="request in loadedRequests"
              :key="request.operationId"
              :http-api="request"
              :is-loading="isLoading"
              :read-only="isReadOnly"
              @onDeleted="onRequestDeleted"
              @callEditor="editRequest"
          />
        </v-row>

        <v-row v-if="isCreatingRequest" justify="center">
          <HttpAPIRequestCreator
              :http-api="currentHttpAPI"
              @close="closeRequestCreator"
              @onCreated="onRequestCreated"
          />
        </v-row>

        <v-row v-if="isEditingRequest" justify="center">
          <HttpAPIRequestEditor
              :http-api="currentHttpAPI"
              :http-api-request="httpAPIRequestToEdit"
              @close="closeRequestEditor"
              @onEdited="onRequestEdited"
          />
        </v-row>

      </v-container>
    </v-col>
    <v-col v-if="isInSettings">
      ye
    </v-col>
    <v-col v-if="isInHelp">
      <HttpAPIHelp/>
    </v-col>
    <v-snackbar
        v-model="showSnackbar"
        :timeout="4000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component, Watch} from 'vue-property-decorator';
import ProjectAPI from "../../domains/project/ProjectAPI";
import {AxiosError, AxiosResponse} from "axios";
import ProjectPOTO from "../../domains/project/ProjectPOTO";
import ExceptionCommons from "../../domains/framework/ExceptionCommons";
import ApplicationAPI from "../../domains/application/ApplicationAPI";
import ApplicationPOTO from "../../domains/application/ApplicationPOTO";
import HttpAPIPOTO from "../../domains/artifacts/httpAPI/HttpAPIPOTO";
import HttpAPIRequestPOTO from "@/domains/artifacts/httpAPI/HttpAPIRequestPOTO";
import HttpAPIAPI from "@/domains/artifacts/httpAPI/HttpAPIAPI";
import HttpAPIHelp from "@/components/httpAPI/HttpAPIHelp.vue";
import HttpAPIRequestCreator from "@/components/httpAPI/HttpAPIRequestCreator.vue";
import HttpAPIListItem from "@/components/httpAPI/HttpAPIListItem.vue";
import HttpAPIRequestEditor from "@/components/httpAPI/HttpAPIRequestEditor.vue";

const HttpApiManagerProps = Vue.extend({
  props: {
    httpApiId: String,
    readOnly: Boolean,
  }
});

enum NavigationType {
  CONTENT,
  SETTINGS,
  HELP,
}

interface NavigationItem {
  label: string;
  icon: string;
  type: NavigationType;
}

@Component({
  components: {HttpAPIRequestEditor, HttpAPIListItem, HttpAPIRequestCreator, HttpAPIHelp}
})
export default class HttpAPIManager extends HttpApiManagerProps {

  isLoading: boolean = true;
  isInContent: boolean = true;
  isInSettings: boolean = false;
  isInHelp: boolean = false;
  isLoadingRequests: boolean = false;
  hasEntriesLoadingError: boolean = false;
  entriesLoadingErrorMessage: string = "";
  isCreatingRequest: boolean = false;
  isEditingRequest: boolean = false;

  requestsSearchWord: string = "";

  httpAPIRequestToEdit: HttpAPIRequestPOTO = new HttpAPIRequestPOTO();

  showSnackbar: boolean = false;
  snackbarText: string = '';

  navigationItems: Array<NavigationItem> = [
    {
      label: "Entries",
      icon: "fas fa-project-diagram",
      type: NavigationType.CONTENT
    },
    {
      label: "Settings",
      icon: "fa fa-cog",
      type: NavigationType.SETTINGS
    },
    {
      label: "Help",
      icon: "fas fa-question",
      type: NavigationType.HELP
    },
  ];

  selectedNavigationItem: NavigationItem = this.navigationItems[0];
  currentProject: ProjectPOTO | null = null;

  currentApplication: ApplicationPOTO | null = null;
  currentHttpAPI: HttpAPIPOTO | null = null;

  requestSearchTimeout: number | null = null;

  loadedRequests: Array<HttpAPIRequestPOTO> = new Array<HttpAPIRequestPOTO>();

  mounted() {
    if (this.$store.state.project.selectedProject != null) {
      this.currentProject = this.$store.state.project.selectedProject;
      this.fillApplication();
    } else {
      this.searchForProject();
    }
  }

  get selectedNavigationItemGetter() {
    return this.selectedNavigationItem;
  }

  @Watch("requestsSearchWord")
  onRequestSearchWordChange(newSearchWord: string, oldSearchWord: string) {
    if (newSearchWord.trim() == oldSearchWord.trim()) return;
    if (this.requestSearchTimeout)
      clearTimeout(this.requestSearchTimeout);
    this.requestSearchTimeout = setTimeout(() => {
      this.searchForHttpAPIRequests()
    }, 500);
  }

  @Watch("selectedNavigationItemGetter")
  onSelectedNavigationItemChange(newItem: NavigationItem | undefined, oldItem: NavigationItem | undefined) {
    if (newItem == undefined) {
      this.selectedNavigationItem = this.navigationItems[2];
      return;
    }
    if (newItem!.type == NavigationType.HELP) {
      this.isInHelp = true;
      this.isInContent = false;
      this.isInSettings = false;
    }
    if (newItem!.type == NavigationType.CONTENT) {
      this.isInHelp = false;
      this.isInContent = true;
      this.isInSettings = false;
    }
    if (newItem!.type == NavigationType.SETTINGS) {
      this.isInHelp = false;
      this.isInContent = false;
      this.isInSettings = true;
    }
  }

  private fillApplication() {
    if (this.$store.state.application.selectedApplication != null) {
      this.currentApplication = this.$store.state.application.selectedApplication;
      this.searchForHttpAPI();
    } else {
      this.searchForApplication();
    }
  }

  private searchForProject() {
    new ProjectAPI().getById(this.$route.params.projectId)
        .then((response: AxiosResponse<ProjectPOTO>) => {
          this.currentProject = response.data;
          this.$store.dispatch("project/setSelectedProject", this.currentProject);
          this.searchForApplication();
        })
        .catch((error: AxiosError) => {
          this.snackbarText = ExceptionCommons.parseErrorMessage(error);
          this.showSnackbar = true;
        })
  }

  private searchForApplication() {
    new ApplicationAPI().getApplication(
        this.$route.params.projectId,
        this.$route.params.applicationId
    ).then((response: AxiosResponse<ApplicationPOTO>) => {
      this.currentApplication = response.data;
      this.$store.dispatch("application/setSelectedApplication", this.currentApplication);
      this.searchForHttpAPI();
    }).catch((error: AxiosError) => {
      this.snackbarText = ExceptionCommons.parseErrorMessage(error);
      this.showSnackbar = true;
    });
  }

  private searchForHttpAPI() {
    new HttpAPIAPI().getHttpAPI(
        this.$route.params.projectId,
        this.$route.params.applicationId,
        this.httpApiId
    ).then((response: AxiosResponse<HttpAPIPOTO>) => {
      this.currentHttpAPI = response.data;
      this.isLoading = false;
      this.isLoadingRequests = true;
      this.searchForHttpAPIRequests();
    }).catch((error: AxiosError) => {
      this.snackbarText = ExceptionCommons.parseErrorMessage(error);
      this.showSnackbar = true;
    })
  }

  private searchForHttpAPIRequestsWithSearchWord() {
    this.isLoadingRequests = true;
    new HttpAPIAPI().searchForRequestsWithSearchWord(
        this.$route.params.projectId,
        this.$route.params.applicationId,
        this.httpApiId,
        this.requestsSearchWord
    ).then((response: AxiosResponse<Array<HttpAPIRequestPOTO>>) => {
      this.loadedRequests = response.data;
    }).catch((error: AxiosError) => {
      this.hasEntriesLoadingError = true;
      this.entriesLoadingErrorMessage = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoadingRequests = false;
    });
  }

  private searchForHttpAPIRequests() {
    if (this.requestsSearchWord.trim().length > 0) {
      this.searchForHttpAPIRequestsWithSearchWord();
      return;
    }
    this.isLoadingRequests = true;
    new HttpAPIAPI().searchForRequests(
        this.$route.params.projectId,
        this.$route.params.applicationId,
        this.httpApiId
    ).then((response: AxiosResponse<Array<HttpAPIRequestPOTO>>) => {
      this.loadedRequests = response.data;
    }).catch((error: AxiosError) => {
      this.hasEntriesLoadingError = true;
      this.entriesLoadingErrorMessage = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoadingRequests = false;
    });
  }

  copyPublicUrlToClipboard() {
    const httpAPIPublicUrl = `${location.host}/#/public/project/${this.$route.params.projectId}/application/${this.$route.params.applicationId}/http-api/${<string>this.currentHttpAPI?.httpApiId}`;
    navigator.clipboard.writeText(httpAPIPublicUrl);
    this.snackbarText = "✨ HTTP API URL copied to your clipboard ✨";
    this.showSnackbar = true;
  }

  openRequestCreator() {
    this.isCreatingRequest = true;
  }

  closeRequestCreator() {
    this.isCreatingRequest = false;
  }

  onRequestCreated() {
    this.isCreatingRequest = false;
    this.searchForHttpAPIRequests();
  }

  get isReadOnly(): boolean {
    return this.readOnly;
  }

  private onRequestDeleted() {
    this.snackbarText = "💣 The request was deleted successfully. Bye bye request! 💣";
    this.showSnackbar = true;
    this.searchForHttpAPIRequests();
  }

  private editRequest(request: HttpAPIRequestPOTO) {
    this.isEditingRequest = true;
    this.httpAPIRequestToEdit = request;
  }

  closeRequestEditor() {
    this.isEditingRequest = false;
  }

  onRequestEdited() {
    this.isEditingRequest = false;
    this.snackbarText = "😉 You successfully edited a request. Good Job! 👌";
    this.showSnackbar = true;
    this.searchForHttpAPIRequests();
  }

}

</script>

<style scoped>

</style>