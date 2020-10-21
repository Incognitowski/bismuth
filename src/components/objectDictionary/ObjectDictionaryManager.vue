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
          <h4 class="font-weight-thin ml-3" v-if="entrySearchWord.trim().length > 0">
            with search word "{{ entrySearchWord.trim() }}"
          </h4>
          <v-tooltip right v-if="currentObjectDictionary.isPubliclyVisible">
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
              label="Search Entries"
              dense
              style="max-width: 200px"
              outlined
              v-model="entrySearchWord"
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
        <v-row v-if="isLoadingEntries && !isCreatingEntry && !isEditingEntry" justify="center">
          <v-progress-circular indeterminate/>
        </v-row>
        <v-row v-if="!isLoadingEntries && !isCreatingEntry && !isEditingEntry && loadedEntries.length === 0"
               justify="center">
          There are no entries on this dictionary yet. Click the plus sign on the upper-right corner to add a new entry.
        </v-row>

        <v-row v-if="!isLoadingEntries && !isCreatingEntry && !isEditingEntry && loadedEntries.length > 0"
               justify="start" dense>
          <DictionaryEntryListItem
              v-for="entry in loadedEntries"
              :key="entry.objectDictionaryEntryId"
              :object-dictionary-entry="entry"
              :is-loading="isLoading"
              @callEditor="editEntry"
          />
        </v-row>

        <v-row v-if="isCreatingEntry" justify="center">
          <DictionaryEntryCreator
              :object-dictionary="currentObjectDictionary"
              @close="closeDictionaryEntryCreator"
              @onCreated="onDictionaryEntryCreated"
          />
        </v-row>

        <v-row v-if="isEditingEntry" justify="center">
          <DictionaryEntryEditor
              :object-dictionary-entry="entryToEdit"
              @close="closeDictionaryEntryEditor"
              @onEdited="onDictionaryEntryEdited"
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
import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";
import DictionaryEntryEditor from "@/components/objectDictionary/DictionaryEntryEditor.vue";
import DictionaryEntryListItem from "@/components/objectDictionary/DictionaryEntryListItem.vue";

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
  components: {
    DictionaryEntryListItem,
    DictionaryEntryEditor, DictionaryEntryCreator, ObjectDictionaryCreator, ObjectDictionaryHelp
  }
})
export default class ObjectDictionaryManager extends ObjectDictionaryManagerProps {

  isLoading: boolean = true;
  isInContent: boolean = true;
  isInSettings: boolean = false;
  isInHelp: boolean = false;
  isLoadingEntries: boolean = false;
  hasEntriesLoadingError: boolean = false;
  entriesLoadingErrorMessage: string = "";
  isCreatingEntry: boolean = false;
  isEditingEntry: boolean = false;

  entrySearchWord: string = "";

  entryToEdit: ObjectDictionaryEntryPOTO = new ObjectDictionaryEntryPOTO();

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
  currentObjectDictionary: ObjectDictionaryPOTO | null = null;

  loadedEntries: Array<ObjectDictionaryEntryPOTO> = new Array<ObjectDictionaryEntryPOTO>();

  mounted() {
    if (this.$store.state.project.selectedProject != null) {
      this.currentProject = this.$store.state.project.selectedProject;
      this.fillApplication();
    } else {
      this.searchForProject();
    }
  }

  onDictionaryEntryCreated() {
    this.closeDictionaryEntryCreator();
    this.searchForEntries();
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

  entrySearchTimeout: number | null = null;

  @Watch("entrySearchWord")
  onEntrySearchWordChange(newSearchWord: string, oldSearchWord: string) {
    if (newSearchWord.trim() == oldSearchWord.trim()) return;
    if (this.entrySearchTimeout)
      clearTimeout(this.entrySearchTimeout);
    this.entrySearchTimeout = setTimeout(() => {
      this.searchForEntries()
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
    new ApplicationAPI().getApplication(
        this.$route.params.projectId,
        this.$route.params.applicationId
    ).then((response: AxiosResponse<ApplicationPOTO>) => {
      this.currentApplication = response.data;
      this.$store.dispatch("application/setSelectedApplication", this.currentApplication);
      this.searchForObjectDictionary();
    }).catch((error: AxiosError) => {
      this.snackbarText = ExceptionCommons.parseErrorMessage(error);
      this.showSnackbar = true;
    });
  }

  private searchForObjectDictionary() {
    new ObjectDictionaryAPI().getObjectDictionary(
        this.$route.params.projectId,
        this.$route.params.applicationId,
        this.objectDictionaryId
    ).then((response: AxiosResponse<ObjectDictionaryPOTO>) => {
      this.currentObjectDictionary = response.data;
      this.isLoading = false;
      this.isLoadingEntries = true;
      this.searchForEntries();
    }).catch((error: AxiosError) => {
      this.snackbarText = ExceptionCommons.parseErrorMessage(error);
      this.showSnackbar = true;
    })
  }

  private searchForEntriesWithSearchWord() {
    this.isLoadingEntries = true;
    new ObjectDictionaryAPI().searchForEntriesWithSearchWord(
        this.$route.params.projectId,
        this.$route.params.applicationId,
        this.objectDictionaryId,
        this.entrySearchWord
    ).then((response: AxiosResponse<Array<ObjectDictionaryEntryPOTO>>) => {
      this.loadedEntries = response.data;
    }).catch((error: AxiosError) => {
      this.hasEntriesLoadingError = true;
      this.entriesLoadingErrorMessage = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoadingEntries = false;
    });
  }

  private searchForEntries() {
    if (this.entrySearchWord.trim().length > 0) {
      this.searchForEntriesWithSearchWord();
      return;
    }
    this.isLoadingEntries = true;
    new ObjectDictionaryAPI().searchForEntries(
        this.$route.params.projectId,
        this.$route.params.applicationId,
        this.objectDictionaryId
    ).then((response: AxiosResponse<Array<ObjectDictionaryEntryPOTO>>) => {
      this.loadedEntries = response.data;
    }).catch((error: AxiosError) => {
      this.hasEntriesLoadingError = true;
      this.entriesLoadingErrorMessage = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoadingEntries = false;
    });
  }

  private editEntry(entry: ObjectDictionaryEntryPOTO) {
    this.isEditingEntry = true;
    entry.objectDictionary = <ObjectDictionaryPOTO>this.currentObjectDictionary;
    this.entryToEdit = entry;
  }

  private copyPublicUrlToClipboard() {
    const dictionaryEntryPublicUrl = `${location.host}/#/public/project/${this.$route.params.projectId}/application/${this.$route.params.applicationId}/dictionary/${<string>this.currentObjectDictionary?.objectDictionaryId}`;
    navigator.clipboard.writeText(dictionaryEntryPublicUrl);
    this.snackbarText = "✨ Object Dictionary URL copied to your clipboard ✨";
    this.showSnackbar = true;
  }

  private closeDictionaryEntryEditor() {
    this.isEditingEntry = false;
  }

  private onDictionaryEntryEdited() {
    this.closeDictionaryEntryEditor();
  }

}

</script>

<style scoped>

</style>