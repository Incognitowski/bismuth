<template>
  <v-card outlined :loading="isLoading">
    <v-card-title>
      <h3>Projects</h3>
      <span class="caption ml-2 mt-2" v-if="projects != null">Showing {{ size }} projects of {{
          projects.totalElements
        }}</span>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              @click="createNewProject"
              icon
              rounded
              v-on="on"
              v-bind="attrs">
            <v-icon>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <span>New Project</span>
      </v-tooltip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text v-if="projects == null">
      <p class="text-center mt-5" v-if="projects == null">No projects were found for your account.</p>
    </v-card-text>
    <v-card-text v-if="projects != null">
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Creation</th>
            <th class="text-left">Created by</th>
            <th class="text-left">Status</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="project in projects.content" :key="project.projectId">
            <td>{{ project.name }}</td>
            <td>{{ parseDate(project.createdAt) }}</td>
            <td>{{ project.createdBy.username }}</td>
            <td v-if="project.active" class="green--text">Active</td>
            <td v-if="!project.active" class="red--text">Inactive</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-row class="mx-0">
        <v-col cols="2">
          <v-combobox
              :disabled="isLoading"
              v-model="size"
              :items="[5, 10]"
              label="Page size"
              outlined
              dense
          ></v-combobox>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-pagination
              v-if="projects != null"
              :disabled="isLoading"
              v-model="page"
              :length="projects.totalPages"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import ProjectAPI from "@/domains/project/ProjectAPI";
import {AxiosError} from "axios";
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import {Intent, IntentAction, IntentResult} from "@/store/modules/Intents";
import Page from "@/domains/framework/data/Page";
import moment from "moment";

@Component
export default class Projects extends Vue {

  isLoading = true;
  page = 1;
  size = 5;
  pageLimit = 0;

  projects: Page<ProjectPOTO> | null = null;

  mounted() {
    this.searchForProjects();
  }

  searchForProjects() {
    this.isLoading = true;
    new ProjectAPI().getAllProjects(this.page, this.size).then(result => {
      console.log(result.data)
      this.projects = result.data;
      this.pageLimit = result.data.totalPages;
    }).catch((error: AxiosError) => {
      console.log(error);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  parseDate(date: number): string {
    return moment(date).format("MMMM Do YYYY, hh:mm");
  }

  createNewProject() {
    const newProject = new ProjectPOTO();
    const intent: Intent<ProjectPOTO> = {
      action: IntentAction.NEW_PROJECT,
      payload: newProject,
      callback: {
        action: (result: IntentResult) => {
          if (result == IntentResult.INTENT_SUCCESS) {
            this.resetSearch();
          }
        }
      }
    };
    this.$store.dispatch(
        "appIntents/setNewProjectIntent",
        intent
    );
  }

  resetSearch() {
    this.page = 1;
  }

  @Watch("size")
  onSizeChange(newSize: number, oldSize: number) {
    this.searchForProjects();
  }

  @Watch("page")
  onPageChange(newPage: number, oldPage: number) {
    this.searchForProjects();
  }

}
</script>
