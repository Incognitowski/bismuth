<template>
    <v-app-bar
            app
            clipped-left
            clipped-right
            dense
            color="accent"
            v-if="this.$store.state.appState.isShowingTopToolbar"
    >
        <img height="30" width="30" class="mr-4" :src="require('../assets/logo.svg')" alt="Bismuth Logo"/>

        <v-toolbar-title>Bismuth</v-toolbar-title>

        <v-menu
                :close-on-content-click="false"
                :nudge-width="200"
                offset-y
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                        class="mx-2"
                        color="transparent"
                        dark
                        depressed
                        small
                        v-bind="attrs"
                        v-on="on">
                    Select a project
                    <v-icon x-small right>fa-chevron-down</v-icon>
                </v-btn>
            </template>

            <v-card class="mt-1">
                <v-card-text>
                    <v-autocomplete
                            dense
                            outlined
                            cache-items
                            class="mx-1"
                            :loading="isLoading"
                            :items="searchedProjects"
                            label="Search projects"
                            :search-input.sync="projectSearchWord"
                    ></v-autocomplete>
                </v-card-text>
            </v-card>
        </v-menu>

        <v-toolbar-title>/</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
            <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-snackbar
                v-model="hasError"
                :timeout="4000"
                bottom
                color="error"
        >
            {{ errorMessage }}
        </v-snackbar>
    </v-app-bar>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import ProjectPOTO from "@/domains/project/ProjectPOTO";
    import AutocompleteObjectHolder from "@/domains/framework/autocomplete/AutocompleteObjectHolder";
    import ProjectAPI from "@/domains/project/ProjectAPI";
    import {AxiosError} from "axios";
    import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";
    import ProjectCommons from "@/domains/project/ProjectCommons";

    @Component
    export default class BismuthAppBar extends Vue {
        isLoading: boolean = false;
        projectSearchWord: string | null = null;
        searchedProjects: Array<AutocompleteObjectHolder<ProjectPOTO>>;
        hasError: boolean = false;
        errorMessage: string = '';

        constructor() {
            super();
            this.searchedProjects = new Array<AutocompleteObjectHolder<ProjectPOTO>>();
        }

        @Watch('projectSearchWord')
        onProjectSearchWordChange(val: string, oldVal: string) {
            this.isLoading = true;
            this.hasError = false;
            new ProjectAPI().searchProjectsByString(val).then(result => {
                this.searchedProjects = ProjectCommons.getProjectsForAutocomplete(result.data);
            }).catch((error: AxiosError) => {
                let message: string;
                try {
                    const exception = DefaultHTTPException.fromAxiosError(error);
                    message = exception.message;
                } catch (e) {
                    message = error.message;
                }
                this.errorMessage = message;
                this.hasError = true;
            }).finally(() => {
                this.isLoading = false;
            })
        }

    }
</script>

<style scoped>

</style>