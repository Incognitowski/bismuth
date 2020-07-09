<template>
    <div></div>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from 'vue-property-decorator';
    import {Intent, IntentResult} from '@/store/modules/Intents';

    @Component
    export default class ActionHolder extends Vue {

        get newProjectIntent() {
            return this.$store.state.appIntents.newProjectIntent;
        }

        @Watch('newProjectIntent')
        onNewProjectIntentChange(
            newIntent: Intent<null> | null,
            oldIntent: Intent<null> | null,
        ) {
            if (newIntent == null) return;
            console.log("updated newproject intent", newIntent, oldIntent)
            setTimeout(() => {
                this.$store.dispatch("appIntents/resolveNewProjectIntent", IntentResult.INTENT_SUCCESS)
            }, 2000)
        }

    }
</script>