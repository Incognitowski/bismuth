<template>
  <v-container fluid class="fill-height mx-5 overflow-y-auto">

    <v-row justify="center" v-if="isLoadingProjectOnStartup">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <v-row v-if="!isLoadingProjectOnStartup" class="mr-5" align="center" justify="space-between">
      <h3 class="font-weight-light">Project <b>{{ currentProject.name }}</b></h3>
      <h5 class="font-weight-thin">Since {{ parseProjectCreationDate(currentProject.createdAt) }}</h5>
    </v-row>

    <v-row v-if="!isLoadingProjectOnStartup" class="mr-5 my-1">
      <v-divider></v-divider>
    </v-row>

    <v-row v-if="!isLoadingProjectOnStartup" class="mr-5" align="baseline" justify="space-between">
      <h5 class="font-weight-thin">
        Created by {{ currentProject.createdBy.username }}. Owned by
        {{ currentProject.ownedBy.username }}
      </h5>
      <v-btn small text color="accent" @click="openEditIntent">Settings</v-btn>
    </v-row>

    <v-row justify="center" class="mr-5" v-if="!isLoadingProjectOnStartup">
      <v-col cols="6">
        <v-text-field
            label="Search for Applications"
            outlined
            dense
            v-model="appSearchWord"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center" class="mr-5" v-if="!isLoadingProjectOnStartup">
      <v-row justify="start" class="ml-0" align="baseline">
        <h3 class="font-weight-light">Applications</h3>
        <h4 class="font-weight-light ml-2 text--secondary" v-if="appSearchWord.length > 0">with search word
          {{ appSearchWord }}</h4>
      </v-row>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              @click="openNewAppIntent"
              v-on="on"
              v-bind="attrs">
            <v-icon>fa fa-plus</v-icon>
          </v-btn>
        </template>
        <span>New App</span>
      </v-tooltip>
    </v-row>

    <v-row v-if="!isLoadingProjectOnStartup" class="mr-5 my-1">
      <v-divider></v-divider>
    </v-row>

    <v-row justify="center" style="min-height: 300px" v-if="!isLoadingProjectOnStartup && loadingApps"
           class="mr-5 my-1">
      <v-progress-circular indeterminate/>
    </v-row>

    <v-container
        fluid
        justify="center"
        class="px-0 mr-5 my-1"
        style="min-height: 300px;"
        v-if="!isLoadingProjectOnStartup && !loadingApps"
    >
      <v-row class="mb-2 mr-0" justify="center" v-for="app in searchedApps" :key="app.applicationId">
        <v-card class="px-5 py-5" style="width: 100%">
          <v-row
              justify="space-between"
              align="baseline"
              class="px-5 mb-3"
          >
            <h4 class="font-weight-light text-decoration-underline" style="cursor: pointer" @click="goToAppPage(app)">
              Application <b>{{ app.name }}</b>
            </h4>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    rounded
                    :disabled="!userIsManagerOrOwner(app)"
                    v-on="on"
                    v-bind="attrs">
                  <v-icon>fas fa-cog</v-icon>
                </v-btn>
              </template>
              <span>Properties</span>
            </v-tooltip>
          </v-row>
          <v-divider class="mb-3"/>
          <v-row justify="space-between" class="px-5">
            <h5 class="font-weight-light">Created by {{ app.createdBy.username }}. Owned by {{
                app.ownedBy.username
              }}</h5>
            <h5 class="font-weight-light">Since {{ parseProjectCreationDate(app.createdAt) }}</h5>
          </v-row>
        </v-card>
      </v-row>
    </v-container>

    <v-snackbar :timeout="5000" v-model="showSnackbar">
      {{ snackBarText }}
    </v-snackbar>

  </v-container>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import ProjectAPI from "@/domains/project/ProjectAPI";
import {AxiosError, AxiosResponse} from "axios";
import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";
import {Intent, IntentAction, IntentResult} from "@/store/modules/Intents";
import DateCommons from "@/domains/framework/DateCommons";
import ApplicationAPI from "@/domains/application/ApplicationAPI";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";
import Page from "@/domains/framework/data/Page";
import ApplicationVisibilityCommons from "@/domains/application/applicationVisibility/ApplicationVisibilityCommons";
import {ApplicationVisibilityEnum} from "@/domains/application/applicationVisibility/ApplicationVisibilityEnum";

@Component
export default class ProjectScreen extends Vue {

  appSearchTimeout: number | null = null;
  loadingApps: boolean = false;

  searchedApps: Array<ApplicationPOTO> | null = null;

  appSearchWord: string = "";

  showSnackbar: boolean = false;
  snackBarText: string = "";

  isLoadingProjectOnStartup: boolean = true;
  currentProject: ProjectPOTO | null = null;

  mounted() {
    if (this.$store.state.project.selectedProject == null) {
      this.searchForProject();
    } else {
      this.currentProject = this.$store.state.project.selectedProject;
      this.isLoadingProjectOnStartup = false;
      this.searchForApplications();
    }
  }

  searchForProject() {
    this.isLoadingProjectOnStartup = true;
    new ProjectAPI().getById(this.$route.params.projectId).then((result: AxiosResponse<ProjectPOTO>) => {
      this.$store.dispatch("project/setSelectedProject", result.data);
      this.currentProject = result.data;
      this.searchForApplications();
    }).catch((error: AxiosError) => {
      let message: string;
      try {
        const exception = DefaultHTTPException.fromAxiosError(error);
        message = exception.message;
      } catch (e) {
        message = e;
      }
      this.snackBarText = message;
      this.showSnackbar = true;
    }).finally(() => {
      this.isLoadingProjectOnStartup = false;
    })
  }

  openEditIntent() {
    const editProjectIntent: Intent<ProjectPOTO> = {
      payload: this.currentProject!!,
      action: IntentAction.EDIT_PROJECT,
      callback: {
        action: (result: IntentResult) => {
          if (result == IntentResult.INTENT_SUCCESS) {
            this.searchForProject();
          }
        }
      }
    }
    this.$store.dispatch("appIntents/setEditProjectIntent", editProjectIntent);
  }

  searchForApplications() {
    this.loadingApps = true;
    if (this.appSearchWord.length == 0) {
      this.searchByPage();
    } else {
      this.searchBySearchString();
    }
  }

  goToAppPage(app: ApplicationPOTO) {
    this.$router.push("/project/" + app.projectId + "/application/" + app.applicationId);
  }

  private searchBySearchString() {
    new ApplicationAPI().searchApplicationsByString(<string>this.currentProject?.projectId, this.appSearchWord)
        .then((result: AxiosResponse<Array<ApplicationPOTO>>) => {
          this.searchedApps = result.data;
        })
        .catch((error: AxiosError) => {
          let message: string;
          try {
            const exception = DefaultHTTPException.fromAxiosError(error);
            message = exception.message;
          } catch (e) {
            message = e;
          }
          this.showSnackbar = true;
          this.snackBarText = message;
        })
        .finally(() => {
          this.loadingApps = false;
        })
  }

  private searchByPage() {
    new ApplicationAPI().getAllApplications(<string>this.currentProject?.projectId, 1, 5)
        .then((result: AxiosResponse<Page<ApplicationPOTO>>) => {
          this.searchedApps = result.data.content;
        })
        .catch((error: AxiosError) => {
          let message: string;
          try {
            const exception = DefaultHTTPException.fromAxiosError(error);
            message = exception.message;
          } catch (e) {
            message = e;
          }
          this.showSnackbar = true;
          this.snackBarText = message;
        })
        .finally(() => {
          this.loadingApps = false;
        })
  }

  openNewAppIntent() {
    const app: ApplicationPOTO = new ApplicationPOTO();
    app.project = <ProjectPOTO>this.currentProject;
    const newAppIntent: Intent<ApplicationPOTO> = {
      action: IntentAction.NEW_APPLICATION,
      payload: app,
      callback: {
        action: (result: IntentResult) => {
          if (result == IntentResult.INTENT_CANCELLED) return;
          this.searchForApplications();
        }
      }
    }
    this.$store.dispatch("appIntents/setNewApplicationIntent", newAppIntent);
  }

  userIsManagerOrOwner(app: ApplicationPOTO) {
    const visibility = ApplicationVisibilityCommons
        .getVisibilityFrom(<string>app.relationShipWithCurrentUser?.visibility);
    return visibility == ApplicationVisibilityEnum.MANAGER || visibility == ApplicationVisibilityEnum.OWNER;
  }

  parseProjectCreationDate(creationDate: number) {
    return DateCommons.parseDate(creationDate);
  }

  get currentProjectInStore(): ProjectPOTO {
    return this.$store.state.project.selectedProject;
  }

  @Watch("currentProjectInStore")
  onCurrentProjectChange(newProject: ProjectPOTO | undefined, oldProject: ProjectPOTO | undefined) {
    if (newProject == undefined) {
      this.$router.push("/dashboard");
      return;
    }
    this.currentProject = newProject;
  }

  @Watch("appSearchWord")
  onAppSearchWordChanged(newWord: string, oldWord: string) {
    if (newWord == oldWord) return;
    if (this.appSearchTimeout)
      clearTimeout(this.appSearchTimeout);
    this.appSearchTimeout = setTimeout(() => {
      this.searchForApplications()
    }, 500);
  }
}
</script>

<style type="text/css" scoped>

.main-container-height {
  height: available;
}

</style>