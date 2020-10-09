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
          <h2 class="font-weight-light">Entries</h2>
          <h4 class="font-weight-light text--secondary ml-2">Showing n of x</h4>
          <v-spacer/>
          <v-text-field
              label="Search Entries"
              dense
              style="max-width: 200px"
              outlined
          ></v-text-field>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  class="ml-3"
                  rounded
                  text
                  v-bind="attrs"
                  v-on="on"
                  :disabled="isLoading"
                  @click="openEntryCreator"
              >
                <v-icon small>fa fa-plus</v-icon>
              </v-btn>
            </template>
            <span>New Entry</span>
          </v-tooltip>
        </v-row>

        <v-row v-if="isLoadingEntries && !isCreatingEntry" justify="center">
          <v-progress-circular indeterminate/>
        </v-row>

        <v-row v-if="!isLoadingEntries && !isCreatingEntry" justify="center">
          <v-progress-circular indeterminate/>
        </v-row>

        <v-row v-if="isCreatingEntry" justify="center">
          <DictionaryEntryCreator
              :object-dictionary="currentObjectDictionary"
              @close="closeDictionaryEntryCreator"
              @onCreated="onDictionaryEntryCreated"
          />
        </v-row>

      </v-container>
    </v-col>
    <v-col v-if="isInSettings">
      ye
    </v-col>
    <v-col v-if="isInHelp">
      <ObjectDictionaryHelp/>
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
import Component from 'vue-class-component'
import {Watch} from "vue-property-decorator";
import ObjectDictionaryHelp from "@/components/objectDictionary/ObjectDictionaryHelp.vue";
import ObjectDictionaryCreator from "@/components/objectDictionary/ObjectDictionaryCreator.vue";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";
import ObjectDictionaryAPI from "@/domains/artifacts/objectDictionary/ObjectDictionaryAPI";
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";
import ProjectAPI from "@/domains/project/ProjectAPI";
import ExceptionCommons from "@/domains/framework/ExceptionCommons";
import {AxiosError, AxiosResponse} from "axios";
import ApplicationAPI from "@/domains/application/ApplicationAPI";
import DictionaryEntryCreator from "@/components/objectDictionary/DictionaryEntryCreator.vue";

const ObjectDictionaryManagerProps = Vue.extend({
  props: {
    objectDictionaryId: String,
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
  components: {DictionaryEntryCreator, ObjectDictionaryCreator, ObjectDictionaryHelp}
})
export default class ObjectDictionaryManager extends ObjectDictionaryManagerProps {

  isLoading: boolean = true;
  isInContent: boolean = true;
  isInSettings: boolean = false;
  isInHelp: boolean = false;
  isLoadingEntries: boolean = false;
  isCreatingEntry: boolean = false;

  showSnackbar: boolean = false;
  snackbarText: string = '';

  onDictionaryEntryCreated() {
    console.log("YEET")
  }

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
  currentObjectDictionary: ObjectDictionaryPOTO | null = null;

  mounted() {
    if (this.$store.state.project.selectedProject != null) {
      this.currentProject = this.$store.state.project.selectedProject;
      this.fillApplication();
    } else {
      this.searchForProject();
    }
  }

  closeDictionaryEntryCreator() {
    this.isCreatingEntry = false;
  }

  openEntryCreator() {
    this.isCreatingEntry = true;
  }

  get selectedNavigationItemGetter() {
    return this.selectedNavigationItem;
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
      this.searchForObjectDictionary();
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
    new ApplicationAPI().getApplication(this.$route.params.projectId, this.$route.params.applicationId)
        .then((response: AxiosResponse<ApplicationPOTO>) => {
          this.currentApplication = response.data;
          this.$store.dispatch("application/setSelectedApplication", this.currentApplication);
          this.searchForObjectDictionary();
        })
        .catch((error: AxiosError) => {
          this.snackbarText = ExceptionCommons.parseErrorMessage(error);
          this.showSnackbar = true;
        });
  }

  private searchForObjectDictionary() {
    new ObjectDictionaryAPI().getObjectDictionary(
        this.$route.params.projectId,
        this.$route.params.applicationId,
        this.objectDictionaryId
    )
        .then((response: AxiosResponse<ObjectDictionaryPOTO>) => {
          this.currentObjectDictionary = response.data;
          this.isLoading = false;
        })
        .catch((error: AxiosError) => {
          this.snackbarText = ExceptionCommons.parseErrorMessage(error);
          this.showSnackbar = true;
        })
  }
}

</script>

<style scoped>

</style>