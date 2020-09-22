<template>
  <div>
    <!-- PROJECT RELATED COMPONENTS -->
    <ProjectCreator v-if="isCreatingNewProject"/>
    <ProjectEditor v-if="isEditingProject"/>
    <ProjectOwnershipTransferCard v-if="isTransferringProjectOwnership"/>
    <ProjectDisablingCard v-if="isDisablingProject"/>

    <!-- APP RELATED COMPONENTS -->
    <AppCreator v-if="isCreatingNewApplication"/>
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

@Component({
  components: {
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

}
</script>