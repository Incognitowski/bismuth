<template>
  <div>
    <!-- PROJECT RELATED COMPONENTS -->
    <ProjectCreator v-if="isCreatingNewProject"/>
    <ProjectEditor v-if="isEditingProject"/>
    <ProjectOwnershipTransferCard v-if="isTransferringProjectOwnership"/>
    <ProjectDisablingCard v-if="isDisablingProject"/>

    <!-- APP RELATED COMPONENTS -->
    <AppCreator v-if="isCreatingNewApplication"/>

    <!-- OBJECT DICTIONARY RELATED COMPONENTS -->
    <ObjectDictionaryCreator v-if="isCreatingNewObjectDictionary"/>
    <ObjectDictionaryManagerDrawer v-if="isEditingObjectManager"/>

    <!-- HTTP API RELATED COMPONENTS -->
    <HttpAPICreator v-if="isCreatingNewHttpAPI"/>
    <HttpAPIManagerDrawer v-if="isEditingHttpAPI"/>

    <!-- TEXT DOCUMENT RELATED COMPONENTS -->
    <TextDocumentDrawer v-if="isCreatingTextDocument || isEditingTextDocument"/>

  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import {Intent} from '@/store/modules/Intents';
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import ProjectCreator from "@/components/project/ProjectCreator.vue";
import ProjectEditor from "@/components/project/ProjectEditor.vue";
import ProjectOwnershipTransferCard from "@/components/project/ProjectOwnershipTransferCard.vue";
import ProjectDisablingCard from "@/components/project/ProjectDisablingCard.vue";
import AppCreator from "@/components/application/AppCreator.vue";
import ApplicationPOTO from "@/domains/application/ApplicationPOTO";
import ObjectDictionaryCreator from "@/components/objectDictionary/ObjectDictionaryCreator.vue";
import HttpAPICreator from "@/components/httpAPI/HttpAPICreator.vue";
import ObjectDictionaryManagerDrawer from "@/components/objectDictionary/ObjectDictionaryManagerDrawer.vue";
import HttpAPIPOTO from "@/domains/artifacts/httpAPI/HttpAPIPOTO";
import HttpAPIManagerDrawer from "@/components/httpAPI/HttpAPIManagerDrawer.vue";
import TextDocumentDrawer from "@/components/textDocument/TextDocumentDrawer.vue";
import TextDocumentPOTO from "@/domains/artifacts/textDocument/TextDocumentPOTO";

@Component({
  components: {
    TextDocumentDrawer,
    HttpAPIManagerDrawer,
    ObjectDictionaryManagerDrawer,
    HttpAPICreator,
    ObjectDictionaryCreator,
    AppCreator,
    ProjectDisablingCard,
    ProjectOwnershipTransferCard,
    ProjectEditor,
    ProjectCreator
  }
})
export default class ActionHolder extends Vue {

  isCreatingNewProject: boolean = false;
  isEditingProject: boolean = false;
  isTransferringProjectOwnership: boolean = false;
  isDisablingProject: boolean = false;

  isCreatingNewApplication: boolean = false;

  isCreatingNewObjectDictionary: boolean = false;
  isEditingObjectManager: boolean = false;

  isCreatingNewHttpAPI: boolean = false;
  isEditingHttpAPI: boolean = false;

  isCreatingTextDocument: boolean = false;
  isEditingTextDocument: boolean = false;

  get newProjectIntent() {
    return this.$store.state.appIntents.newProjectIntent;
  }

  get editProjectIntent() {
    return this.$store.state.appIntents.editProjectIntent;
  }

  get transferProjectIntent() {
    return this.$store.state.appIntents.projectTransferIntent;
  }

  get disableProjectIntent() {
    return this.$store.state.appIntents.projectDisableIntent;
  }

  get newAppIntent() {
    return this.$store.state.appIntents.newApplicationIntent;
  }

  get newObjectDictionaryIntent() {
    return this.$store.state.appIntents.newObjectDictionaryIntent;
  }

  get editObjectDictionaryIntent() {
    return this.$store.state.appIntents.editObjectDictionaryIntent;
  }

  get newHttpAPIIntent() {
    return this.$store.state.appIntents.newHttpAPIIntent;
  }

  get editHttpAPIIntent() {
    return this.$store.state.appIntents.editHttpAPIIntent;
  }

  get newTextDocumentIntent() {
    return this.$store.state.appIntents.newTextDocumentIntent;
  }

  get editTextDocumentIntent() {
    return this.$store.state.appIntents.editTextDocumentIntent;
  }

  @Watch('newTextDocumentIntent')
  onNewTextDocumentIntentChange(
      newIntent: Intent<TextDocumentPOTO> | null,
      oldIntent: Intent<TextDocumentPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isCreatingTextDocument = false;
      return;
    }
    this.isCreatingTextDocument = true;
  }

  @Watch('editTextDocumentIntent')
  onEditTextDocumentIntentChange(
      newIntent: Intent<TextDocumentPOTO> | null,
      oldIntent: Intent<TextDocumentPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isEditingTextDocument = false;
      return;
    }
    this.isEditingTextDocument = true;
  }

  @Watch('disableProjectIntent')
  onProjectDisableIntentChange(
      newIntent: Intent<ProjectPOTO> | null,
      oldIntent: Intent<ProjectPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isDisablingProject = false;
      return;
    }
    this.isDisablingProject = true;
  }

  @Watch('transferProjectIntent')
  onProjectTransferIntentChange(
      newIntent: Intent<ProjectPOTO> | null,
      oldIntent: Intent<ProjectPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isTransferringProjectOwnership = false;
      return;
    }
    this.isTransferringProjectOwnership = true;
  }

  @Watch('newProjectIntent')
  onNewProjectIntentChange(
      newIntent: Intent<ProjectPOTO> | null,
      oldIntent: Intent<ProjectPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isCreatingNewProject = false;
      return;
    }
    this.isCreatingNewProject = true;
  }

  @Watch('editProjectIntent')
  onEditProjectIntentChange(
      newIntent: Intent<ProjectPOTO> | null,
      oldIntent: Intent<ProjectPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isEditingProject = false;
      return;
    }
    this.isEditingProject = true;
  }

  @Watch('newAppIntent')
  onNewApplicationIntentChange(
      newIntent: Intent<ApplicationPOTO> | null,
      oldIntent: Intent<ApplicationPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isCreatingNewApplication = false;
      return;
    }
    this.isCreatingNewApplication = true;
  }

  @Watch('newObjectDictionaryIntent')
  onNewObjectDictionaryIntentChange(
      newIntent: Intent<ApplicationPOTO> | null,
      oldIntent: Intent<ApplicationPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isCreatingNewObjectDictionary = false;
      return;
    }
    this.isCreatingNewObjectDictionary = true;
  }

  @Watch('editObjectDictionaryIntent')
  onEditObjectDictionaryIntentChange(
      newIntent: Intent<ApplicationPOTO> | null,
      oldIntent: Intent<ApplicationPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isEditingObjectManager = false;
      return;
    }
    this.isEditingObjectManager = true;
  }

  @Watch('newHttpAPIIntent')
  onNewHttpAPIIntentChange(
      newIntent: Intent<ApplicationPOTO> | null,
      oldIntent: Intent<ApplicationPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isCreatingNewHttpAPI = false;
      return;
    }
    this.isCreatingNewHttpAPI = true;
  }

  @Watch('editHttpAPIIntent')
  onEditHttpAPIIntentChange(
      newIntent: Intent<HttpAPIPOTO> | null,
      oldIntent: Intent<HttpAPIPOTO> | null,
  ) {
    if (newIntent == null) {
      this.isEditingHttpAPI = false;
      return;
    }
    this.isEditingHttpAPI = true;
  }

}
</script>