<template>
    <v-bottom-sheet inset persistent v-model="isSheetOpen">
        <v-sheet>
            <v-container class="px-10 py-10">
                <v-row v-if="isLoading" class="mb-5">
                    <v-progress-linear indeterminate></v-progress-linear>
                </v-row>
                <v-row class="mb-5 align-baseline">
                    <h2>New Project</h2>
                    <v-spacer></v-spacer>
                    <v-btn
                            :disabled="isLoading"
                            text
                            color="red"
                            @click="cancelProjectCreation"
                    >close
                    </v-btn>
                </v-row>
                <v-form>
                    <v-row>
                        <v-text-field
                                :disabled="isLoading"
                                v-model="newProject.name"
                                label="Project Name"
                                outlined
                                dense
                        ></v-text-field>
                    </v-row>
                    <v-row>
                        <v-checkbox :disabled="isLoading" class="mx-auto" v-model="newProject.isPubliclyVisible"
                                    label="This project is publicly visible to everyone with its URL"></v-checkbox>
                    </v-row>
                    <v-row class="mb-3">
                        <v-spacer></v-spacer>
                        <v-btn
                                :loading="isLoading"
                                :disabled="isLoading"
                                text
                                color="success"
                                @click="createProject"
                        >CREATE PROJECT
                        </v-btn>
                    </v-row>
                    <v-row class="mb-16 justify-center">
                        <v-alert dense outlined type="success" v-if="isDoneCreating">
                            {{ successMessage }}
                        </v-alert>
                        <v-alert dense type="error" v-if="hasError">
                            {{ errorMessage }}
                        </v-alert>
                    </v-row>
                </v-form>
            </v-container>
        </v-sheet>
    </v-bottom-sheet>
</template>

<script lang="ts">
    import ProjectPOTO from "@/domains/project/ProjectPOTO";
    import {Component, Vue} from 'vue-property-decorator';
    import {Intent, IntentResult} from "@/store/modules/Intents";
    import ProjectAPI from "@/domains/project/ProjectAPI";
    import {AxiosError, AxiosResponse} from "axios";
    import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";

    @Component
    export default class ProjectCreator extends Vue {

        isDoneCreating: boolean = false;
        successMessage: string = "";

        hasError: boolean = false;
        errorMessage: string = "";

        isLoading: boolean = false;
        isSheetOpen: boolean = true;
        newProject: ProjectPOTO;

        constructor() {
            super();
            this.newProject = new ProjectPOTO();
            this.newProject.name = "";
            this.newProject.active = true;
        }

        mounted() {
            const newProjectIntent: Intent<ProjectPOTO> = this.$store.state.appIntents.newProjectIntent;
            this.newProject.name = newProjectIntent.payload.name;
        }

        cancelProjectCreation() {
            this.isSheetOpen = false;
            setTimeout(() => {
                this.$store.dispatch("appIntents/resolveNewProjectIntent", IntentResult.INTENT_CANCELLED)
            }, 250)
        }

        finishProjectCreation() {
            this.isSheetOpen = false;
            setTimeout(() => {
                this.$store.dispatch("appIntents/resolveNewProjectIntent", IntentResult.INTENT_SUCCESS)
            }, 250)
        }

        createProject() {
            this.isLoading = true;
            this.hasError = false;
            new ProjectAPI().createProject(this.newProject).then((result: AxiosResponse<ProjectPOTO>) => {
                this.successMessage = `Nice! You just created the ${this.newProject.name} project! I shall lead you to the project page now 🎇`;
                this.isDoneCreating = true;
                setTimeout(() => {
                    this.$router.replace('/project/' + result.data.project_id);
                    this.finishProjectCreation();
                }, 3000);
            }).catch((error: AxiosError) => {
                let message: string;
                try {
                    const exception = DefaultHTTPException.fromAxiosError(error);
                    message = exception.message;
                } catch (e) {
                    message = e;
                }
                this.hasError = true;
                this.errorMessage = message;
                this.isLoading = false;
            });
        }

    }
</script>