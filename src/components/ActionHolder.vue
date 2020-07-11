<template>
    <div>
        <ProjectCreator v-if="isCreatingNewProject"/>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator';
    import {Intent} from '@/store/modules/Intents';
    import ProjectPOTO from "@/domains/project/ProjectPOTO";
    import ProjectCreator from "@/components/ProjectCreator.vue";

    @Component({
        components: {
            ProjectCreator
        }
    })
    export default class ActionHolder extends Vue {

        isCreatingNewProject: boolean = false;

        get newProjectIntent() {
            return this.$store.state.appIntents.newProjectIntent;
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

    }
</script>