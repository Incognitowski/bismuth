<template>
  <v-navigation-drawer
      v-model="isDrawerOpen"
      absolute
      stateless
      temporary
      class="artifact-drawer-width"
  >
    <v-container fluid v-if="isLoading">
      <v-row class="mt-10" justify="center">
        <v-progress-circular indeterminate/>
      </v-row>
    </v-container>
    <v-container v-if="!isLoading && textDocument != null">
      <v-row no-gutters justify="space-between" align="center">
        <h4 class="font-weight-light">
          <v-icon small class="mr-2">
            fas fa-book-open
          </v-icon>
          <b>{{ textDocument.name }}</b>
          <span class="text--secondary text-caption ml-1">Text Document</span>
        </h4>
        <v-btn
            text
            small
            color="red"
            @click="closeDrawer"
        >
          CLOSE
        </v-btn>
      </v-row>
      <v-row justify="center" class="mt-2">
        <v-divider/>
      </v-row>
      <v-row class="mt-5" no-gutters v-if="textDocument != null" justify="center" align="start">
        <v-list shaped width="auto">
          <v-list-item-group v-model="selectedNavigationItem" color="accent">
            <v-list-item
                class="mb-1"
                v-for="item in navigationItems"
                :key="item.type"
                :value="item"
            >
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                      v-bind="attrs"
                      v-on="on"
                      v-text="item.icon"
                  />
                </template>
                <span>{{ item.label }}</span>
              </v-tooltip>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-col v-if="isInContent">
          <v-row no-gutters justify="space-between" align="center" class="mb-3">
            <h3 v-if="isEditing" class="font-weight-light">Edit Text Document - {{ textDocument.name }}</h3>
            <h3 v-if="!isEditing" class="font-weight-light">Create Text Document</h3>
            <v-btn @click="saveDocument" text color="green">SAVE</v-btn>
          </v-row>

          <v-alert
              v-model="hasError"
              dense
              dismissible
              outlined
              type="error"
          >
            {{ errorMessage }}
          </v-alert>
          <v-alert
              v-model="hasSuccess"
              dense
              dismissible
              outlined
              type="success"
          >
            {{ successMessage }}
          </v-alert>

          <v-row no-gutters align="start">
            <v-text-field
                v-model="textDocument.name"
                label="Name"
                class="mb-3"
                persistent-hint
                dense
                hint="Give your text document a declarative name"
                outlined
            />
          </v-row>
          <v-row no-gutters justify="space-between" align="center" class="mb-2">
            <h4 class="font-weight-light">Content</h4>
          </v-row>
          <v-card :light="true">
            <v-card-text>
              <mc-wysiwyg v-model="textDocument.content"/>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="isInSettings">
          To be implemented
        </v-col>
        <v-col v-if="isInHelp">
          <v-container fluid>
            <v-row justify="start" align="baseline">
              <h2 class="font-weight-light">Text Document</h2>
              <h3 class="font-weight-light text--secondary ml-2">How does it work?</h3>
            </v-row>
            <v-row class="my-2">
              <v-divider/>
            </v-row>
            <v-card outlined>
              <v-card-text>
                <p class="body-1">
                  You can use <b class="green--text">Text Documents</b> to write anything you'd like other users to know
                  about the application.
                </p>
                <p class="body-1">
                  Do you need to write a specific rule? Need to write some tech specs about your project?
                  You can use text documents for this. And it's as simple as it gets.
                </p>
                <p class="body-1">
                  Write it down. Save it. And there it goes, you're creating text documents.
                </p>
              </v-card-text>
            </v-card>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {McWysiwyg} from '@mycure/vue-wysiwyg';
import {Vue, Component} from 'vue-property-decorator';
import {Intent, IntentResult} from "@/store/modules/Intents";
import TextDocumentPOTO from "@/domains/artifacts/textDocument/TextDocumentPOTO";
import TextDocumentAPI from "@/domains/artifacts/textDocument/TextDocumentAPI";
import {AxiosError, AxiosResponse} from "axios";
import HttpAPIPOTO from "@/domains/artifacts/httpAPI/HttpAPIPOTO";
import ExceptionCommons from "@/domains/framework/ExceptionCommons";

enum NavigationType {
  CONTENT,
  SETTINGS,
  HELP,
}

interface NavigationItem {
  label: string;
  icon: string;
  type: NavigationType;
}

@Component({
  components: {
    McWysiwyg
  }
})
export default class TextDocumentDrawer extends Vue {

  isEditing: boolean = false;

  isLoading: boolean = false;
  isDrawerOpen: boolean = false;

  textDocument: TextDocumentPOTO | null = null;

  hasError: boolean = false;
  errorMessage: string = '';

  hasSuccess: boolean = false;
  successMessage: string = '';

  navigationItems: Array<NavigationItem> = [
    {
      label: "Content",
      icon: "fas fa-book-open",
      type: NavigationType.CONTENT
    },
    {
      label: "Settings",
      icon: "fa fa-cog",
      type: NavigationType.SETTINGS
    },
    {
      label: "Help",
      icon: "fas fa-question",
      type: NavigationType.HELP
    },
  ];

  selectedNavigationItem: NavigationItem = this.navigationItems[0];

  mounted() {
    setTimeout(() => {
      this.isDrawerOpen = true;
    }, 150);
    let intent: Intent<TextDocumentPOTO>;
    if (this.$store.state.appIntents.editTextDocumentIntent) {
      intent = this.$store.state.appIntents.editTextDocumentIntent;
      console.log('edit', intent);
    } else {
      intent = this.$store.state.appIntents.newTextDocumentIntent;
      console.log('new', intent);
    }
    this.textDocument = intent.payload;
    if (this.textDocument.textDocumentId.length > 0) {
      this.isEditing = true;
    }
    this.isLoading = false;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    setTimeout(() => {
      if (this.isEditing) {
        this.$store.dispatch("appIntents/resolveEditTextDocumentIntent", IntentResult.INTENT_CANCELLED);
      } else {
        this.$store.dispatch("appIntents/resolveNewTextDocumentIntent", IntentResult.INTENT_CANCELLED);
      }
    }, 250);
  }

  saveDocument() {
    if (this.isEditing) {
      this.editDocument();
    } else {
      this.createDocument();
    }
  }

  get isInContent(): boolean {
    return this.selectedNavigationItem.type == NavigationType.CONTENT;
  }

  get isInSettings(): boolean {
    return this.selectedNavigationItem.type == NavigationType.SETTINGS;
  }

  get isInHelp(): boolean {
    return this.selectedNavigationItem.type == NavigationType.HELP;
  }

  private createDocument() {
    this.isLoading = true;
    this.hasSuccess = false;
    this.hasError = false;
    new TextDocumentAPI().createDocument(
        <string>this.textDocument?.application.projectId,
        <string>this.textDocument?.application.applicationId,
        <TextDocumentPOTO>this.textDocument
    ).then((response: AxiosResponse<TextDocumentPOTO>) => {
      this.hasSuccess = true;
      this.successMessage = "You just created the " + this.textDocument?.name + " text document.";
      setTimeout(() => {
        this.$store.dispatch("appIntents/resolveNewTextDocumentIntent", IntentResult.INTENT_SUCCESS);
      }, 2000);
    }).catch((error: AxiosError) => {
      this.hasError = true;
      this.errorMessage = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  private editDocument() {
    this.isLoading = true;
    this.hasSuccess = false;
    this.hasError = false;
    new TextDocumentAPI().editDocument(
        <string>this.textDocument?.application.projectId,
        <string>this.textDocument?.application.applicationId,
        <TextDocumentPOTO>this.textDocument
    ).then((response: AxiosResponse<TextDocumentPOTO>) => {
      this.hasSuccess = true;
      this.successMessage = "Document saved ✔";
    }).catch((error: AxiosError) => {
      this.hasError = true;
      this.errorMessage = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoading = false;
    })
  }

}
</script>

<style scoped>

.artifact-drawer-width {
  min-width: 800px;
  max-width: 1200px;
  width: calc(100vw - 30vw) !important;
}

</style>