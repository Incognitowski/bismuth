<template>
  <v-bottom-sheet overlay-color="#000000" inset persistent v-model="isSheetOpen">
    <v-sheet>
      <v-container class="px-10 py-10">
        <v-row v-if="isLoading" class="mb-5">
          <v-progress-linear indeterminate></v-progress-linear>
        </v-row>
        <v-row class="mb-5 align-baseline">
          <h2>Edit Project</h2>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="isLoading"
              text
              color="red"
              @click="cancelProjectEditing"
          >close
          </v-btn>
        </v-row>
        <v-row class="mb-5">
          <v-tabs
              v-model="currentTab"
              center-active
              dark
              centered
              grow
          >
            <v-tab>Basic Information</v-tab>
            <v-tab>Access</v-tab>
            <v-tab>Events</v-tab>
          </v-tabs>
        </v-row>
        <v-tabs-items v-model="currentTab">
          <v-tab-item>
            <v-form class="mt-10 mb-10">
              <v-row>
                <v-text-field
                    :disabled="isLoading"
                    v-model="projectToEdit.name"
                    label="Project Name"
                    outlined
                    dense
                ></v-text-field>
              </v-row>
              <v-row>
                <v-checkbox :disabled="isLoading" class="mx-auto" v-model="projectToEdit.isPubliclyVisible"
                            label="This project is publicly visible to everyone with its URL"></v-checkbox>
              </v-row>
              <v-row class="mb-10">
                <v-spacer></v-spacer>
                <v-btn
                    :loading="isLoading"
                    :disabled="isLoading"
                    text
                    color="success"
                    @click="saveProjectInformation"
                >SAVE
                </v-btn>
              </v-row>
            </v-form>
          </v-tab-item>
          <v-tab-item>
            <v-row>
              <h3>Users related to project</h3>
              <v-spacer/>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      @click="isAddingNewUserToProject = true"
                      icon
                      rounded
                      v-on="on"
                      v-bind="attrs">
                    <v-icon>fas fa-user-plus</v-icon>
                  </v-btn>
                </template>
                <span>Add User</span>
              </v-tooltip>
            </v-row>
            <v-card class="mt-2 mb-2 px-5" outlined v-if="isAddingNewUserToProject">
              <v-card-title>
                Add user to project
                <v-spacer/>
                <v-btn
                    :disabled="isLoading"
                    text
                    color="red"
                    @click="isAddingNewUserToProject = false"
                >cancel
                </v-btn>
              </v-card-title>
              <v-card-text></v-card-text>
              <v-autocomplete
                  dense
                  outlined
                  hide-no-data
                  hide-selected
                  return-object
                  clearable
                  v-model="selectedUser"
                  :loading="isLoadingUserAutocomplete"
                  label="Search for User"
                  :items="searchedUsers"
                  :search-input.sync="userSearchWord"
              >
              </v-autocomplete>
              <v-combobox
                  outlined
                  dense
                  label="Select a role for this user"
                  v-model="selectedRole"
                  :items="['MANAGER','DEVELOPER','STAKEHOLDER']"
              ></v-combobox>
              <v-row class="mb-3">
                <v-spacer/>
                <v-btn
                    :loading="isLoading"
                    :disabled="isLoading"
                    text
                    color="success"
                    @click="addUserToProject"
                >SAVE
                </v-btn>
              </v-row>
            </v-card>
            <v-simple-table class="mb-16" v-if="usersRelatedToProject != null && usersRelatedToProject.length > 0">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Since</th>
                  <th class="text-left">Updated</th>
                  <th class="text-left">Relationship</th>
                  <th class="text-left"></th>
                  <th class="text-left"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in usersRelatedToProject" :key="user.userId">
                  <td>{{ user.username }}</td>
                  <td>{{ parseCreationDateFromRelationship(user) }}</td>
                  <td>{{ parseUpdateDateFromRelationship(user) }}</td>
                  <td>{{ parseVisibilityOfProjectOf(user) }}</td>
                  <td></td>
                  <td></td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-row v-if="usersRelatedToProject == null">
              <v-spacer/>
              <h4>Loading...</h4>
              <v-spacer/>
            </v-row>
            <v-row v-if="usersRelatedToProject != null && usersRelatedToProject.length === 0 && !isLoading">
              <v-spacer/>
              <h4>No user related to this project.</h4>
              <v-spacer/>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-sheet>

    <!-- SNACKBACK -->
    <v-snackbar
        v-model="showSnackBar"
        timeout="5000"
        :color="hasError ? 'red' : 'green'"
    >
      {{ snackBarText }}
    </v-snackbar>
  </v-bottom-sheet>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import ProjectPOTO from "@/domains/project/ProjectPOTO";
import {Intent, IntentResult} from "@/store/modules/Intents";
import ProjectAPI from "@/domains/project/ProjectAPI";
import {AxiosError, AxiosResponse} from "axios";
import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";
import UserPOTO from "@/domains/user/UserPOTO";
import DateCommons from "@/domains/framework/DateCommons";
import ProjectVisibilityCommons from "@/domains/project/projectVisibility/ProjectVisibilityCommons";
import AutocompleteObjectHolder from "@/domains/framework/autocomplete/AutocompleteObjectHolder";
import UserAPI from "@/domains/user/UserAPI";
import UserCommons from "@/domains/user/UserCommons";
import ProjectVisibilityPOTO from "@/domains/project/projectVisibility/ProjectVisibilityPOTO";

@Component
export default class ProjectEditor extends Vue {

  changedProjectsProperties = false;

  currentTab = null;
  isSheetOpen = true;
  isLoading = false;

  hasError = false;
  errorMessage = "";

  showSnackBar = false;
  snackBarText = "";

  isAddingNewUserToProject = false;

  projectToEdit: ProjectPOTO;

  usersRelatedToProject?: Array<UserPOTO> | null = null;

  selectedUser: AutocompleteObjectHolder<UserPOTO> | null = null;
  selectedRole: string | null = null;
  isLoadingUserAutocomplete = false;
  searchedUsers: Array<AutocompleteObjectHolder<UserPOTO>> = new Array<AutocompleteObjectHolder<UserPOTO>>();
  userSearchWord = "";

  constructor() {
    super();
    this.projectToEdit = new ProjectPOTO();
    this.projectToEdit.isPubliclyVisible = false;
    this.projectToEdit.name = "Loading...";
  }

  mounted() {
    const editProjectIntent: Intent<ProjectPOTO> = this.$store.state.appIntents.editProjectIntent;
    Object.assign(this.projectToEdit, editProjectIntent.payload)
  }

  cancelProjectEditing() {
    this.isSheetOpen = false;
    setTimeout(() => {
      if (this.changedProjectsProperties) {
        this.$store.dispatch("appIntents/resolveEditProjectIntent", IntentResult.INTENT_SUCCESS)
      } else {
        this.$store.dispatch("appIntents/resolveEditProjectIntent", IntentResult.INTENT_CANCELLED)
      }
    }, 250)
  }

  saveProjectInformation() {
    this.isLoading = true;
    this.hasError = false;
    new ProjectAPI().editProject(this.projectToEdit).then((result: AxiosResponse<ProjectPOTO>) => {
      this.snackBarText = "Your new project properties were saved. ✌";
      this.showSnackBar = true;
      this.isLoading = false;
      this.changedProjectsProperties = true;
    }).catch((error: AxiosError) => {
      let message: string;
      try {
        const exception = DefaultHTTPException.fromAxiosError(error);
        message = exception.message;
      } catch (e) {
        message = e;
      }
      this.hasError = true;
      this.isLoading = false;
      this.snackBarText = message;
      this.showSnackBar = true;
    });
  }

  loadUsersRelatedToProject() {
    this.isLoading = true;
    this.hasError = false;
    new ProjectAPI().getUsersRelatedToProject(this.projectToEdit).then((result: AxiosResponse<Array<UserPOTO>>) => {
      this.isLoading = false;
      this.usersRelatedToProject = result.data;
    }).catch((error: AxiosError) => {
      let message: string;
      try {
        const exception = DefaultHTTPException.fromAxiosError(error);
        message = exception.message;
      } catch (e) {
        message = e;
      }
      this.hasError = true;
      this.isLoading = false;
      this.snackBarText = message;
      this.showSnackBar = true;
    });
  }

  searchForUsers() {
    this.isLoadingUserAutocomplete = true;
    this.hasError = false;
    new UserAPI().searchByUsername(this.userSearchWord).then((result: AxiosResponse<Array<UserPOTO>>) => {
      this.searchedUsers = UserCommons.getUsersForAutocomplete(result.data);
      this.isLoadingUserAutocomplete = false;
    }).catch((error: AxiosError) => {
      let message: string;
      try {
        const exception = DefaultHTTPException.fromAxiosError(error);
        message = exception.message;
      } catch (e) {
        message = e;
      }
      this.hasError = true;
      this.isLoadingUserAutocomplete = false;
      this.snackBarText = message;
      this.showSnackBar = true;
    });
  }

  parseVisibilityOfProjectOf(user: UserPOTO): string {
    return ProjectVisibilityCommons.getReadableVisibilityFrom(<string>user?.relationshipWithCurrentProject?.visibility);
  }

  parseCreationDateFromRelationship(user: UserPOTO): string {
    return DateCommons.parseDate(<number>user?.relationshipWithCurrentProject?.createdAt);
  }

  parseUpdateDateFromRelationship(user: UserPOTO): string {
    if (user?.relationshipWithCurrentProject?.updatedAt == user.relationshipWithCurrentProject?.createdAt)
      return "N/A";
    return DateCommons.parseDate(<number>user?.relationshipWithCurrentProject?.updatedAt);
  }

  addUserToProject() {
    this.isLoading = true;
    this.hasError = false;
    this.showSnackBar = true;
    const visibility: ProjectVisibilityPOTO = {
      project_id: this.projectToEdit.projectId,
      user_id: this.selectedUser?.value.userId,
      visibility: this.selectedRole
    }
    console.log(visibility);
    new ProjectAPI().attachUserToProject(visibility).then(() => {
      this.snackBarText = "Great! Now " + this.selectedUser?.value.username + " is a part of the " + this.projectToEdit.name + " project. 😎";
      this.showSnackBar = true;
      this.isAddingNewUserToProject = false;
      this.isLoading = false;
      this.userSearchWord = "";
      this.selectedRole = null;
      this.selectedUser = null;
      this.searchedUsers = null;
      this.loadUsersRelatedToProject();
    }).catch((error: AxiosError) => {
      let message: string;
      try {
        const exception = DefaultHTTPException.fromAxiosError(error);
        message = exception.message;
      } catch (e) {
        message = e;
      }
      this.hasError = true;
      this.isLoading = false;
      this.snackBarText = message;
      this.showSnackBar = true;
    })
  }

  @Watch("userSearchWord")
  onUserSearchWordChange(newSearchWord: string, oldSearchWord: string) {
    if (newSearchWord == null) return;
    if (newSearchWord.length == 0) return;
    this.searchForUsers();
  }

  @Watch("currentTab")
  onCurrentTabChange(newTab: number, oldTab: number) {
    if (newTab != 1) return;
    this.loadUsersRelatedToProject();
  }

}

</script>

<style scoped>

</style>