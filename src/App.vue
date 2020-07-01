<template>
    <v-app>
        <div v-if="isGloballyLoading">
            Carregando
        </div>
        <router-view v-if="!isGloballyLoading"/>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class App extends Vue {

        mounted() {
            setTimeout(() => {
                this.$store.dispatch('setGlobalLoadingState', false)
            }, 2000);
        }

        get isGloballyLoading(): boolean {
            return this.$store.state.appState.isGloballyLoading;
        }
    }
</script>

