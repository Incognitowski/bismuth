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
                offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                        class="mx-2"
                        color="transparent"
                        dark
                        depressed
                        small
                        v-bind="attrs"
                        v-on="on">
                    {{ projectDropdownTitle }}
                    <v-icon x-small right>fa-chevron-down</v-icon>
                </v-btn>
            </template>

            <v-card class="mt-1">
                <v-card-text>
                    <v-row class="align-baseline">
                        <v-autocomplete
                                dense
                                outlined
                                class="mx-1"
                                hide-no-data
                                hide-selected
                                return-object
                                clearable
                                v-model="selectedProject"
                                :loading="isLoading"
                                label="Search projects"
                                :items="searchedProjects"
                                :search-input.sync="projectSearchWord"
                        >
                        </v-autocomplete>
                        <v-btn v-on:click="createNewProject" depressed rounded icon>
                            <v-icon small>fas fa-plus</v-icon>
                        </v-btn>
                    </v-row>
                    <v-alert
                            dense
                            class="text-caption"
                            v-if="showProjectSearchAlert"
                            outlined
                            :color="projectSearchAlertColor"
                    >
                        {{ projectSearchAlertMessage }}
                    </v-alert>
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
    import {Intent, IntentAction, IntentCallbackInterface, IntentResult} from "@/store/modules/Intents";

    @Component
    export default class BismuthAppBar extends Vue {
        isLoading: boolean = false;
        projectSearchWord: string | null = null;
        searchedProjects: Array<AutocompleteObjectHolder<ProjectPOTO>>;
        hasError: boolean = false;
        errorMessage: string = '';
        selectedProject: AutocompleteObjectHolder<ProjectPOTO> | null = null;
        projectSearchAlertMessage: string = "Start typing to search your projects";
        projectSearchAlertColor: string = "accent";
        showProjectSearchAlert: boolean = true;
        projectDropdownTitle: string = "Select a project";
        sheet = true;

        constructor() {
            super();
            this.searchedProjects = new Array<AutocompleteObjectHolder<ProjectPOTO>>();
        }

        @Watch('selectedProject')
        onSelectedProjectChange(
            newProject: AutocompleteObjectHolder<ProjectPOTO> | undefined,
            oldProject: AutocompleteObjectHolder<ProjectPOTO> | undefined
        ) {
            if (undefined == newProject) {
                this.projectDropdownTitle = "Select a project";
                this.$router.push("/dashboard");
                return
            }
            const selectedProject = newProject.value;
            this.projectDropdownTitle = selectedProject.name;
            this.$router.push("/project/" + selectedProject.project_id);
        }

        @Watch('projectSearchWord')
        onProjectSearchWordChange(val: string, oldVal: string) {
            if (val == '' || val == null) {
                this.showProjectSearchAlert = true;
                this.projectSearchAlertColor = "accent";
                this.projectSearchAlertMessage = "Start typing to search your projects";
                return;
            }
            this.isLoading = true;
            this.hasError = false;
            new ProjectAPI().searchProjectsByString(val).then(result => {
                this.searchedProjects = ProjectCommons.getProjectsForAutocomplete(result.data);
                if (this.searchedProjects.length == 0) {
                    this.showProjectSearchAlert = true;
                    this.projectSearchAlertColor = "error";
                    this.projectSearchAlertMessage = "You have no projects with this name...";
                } else {
                    this.showProjectSearchAlert = false;
                }
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

        createNewProject() {
            const newProject = new ProjectPOTO();
            newProject.name = this.projectSearchWord || "";
            const intent: Intent<ProjectPOTO> = {
                action: IntentAction.NEW_PROJECT,
                payload: newProject,
                callback: {
                    action(result: IntentResult) {
                    }
                }
            };
            this.$store.dispatch(
                "appIntents/setNewProjectIntent",
                intent
            );
        }

    }
</script>

<style scoped>

</style>