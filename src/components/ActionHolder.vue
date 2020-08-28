<template>
  <div>
    <ProjectCreator v-if="isCreatingNewProject"/>
    <ProjectEditor v-if="isEditingProject"/>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import {Intent} from '@/store/modules/Intents';
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import ProjectCreator from "@/components/project/ProjectCreator.vue";
import ProjectEditor from "@/components/project/ProjectEditor.vue";

@Component({
  components: {
    ProjectEditor,
    ProjectCreator
  }
})
export default class ActionHolder extends Vue {

  isCreatingNewProject: boolean = false;
  isEditingProject: boolean = false;

  get newProjectIntent() {
    return this.$store.state.appIntents.newProjectIntent;
  }

  get editProjectIntent() {
    return this.$store.state.appIntents.editProjectIntent;
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

}
</script>