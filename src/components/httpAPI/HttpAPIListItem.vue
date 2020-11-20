<template>
  <v-card class="mt-3" style="width: 100%" outlined>
    <v-card-title>
      <v-row no-gutters align="baseline">
        <span class="text-ali font-weight-light text-overline" :class="[methodLabelClass]">
          {{ artifact.method }}
        </span>
        <span class="ml-3" :class="{'text-decoration-line-through' : artifact.deprecated}">
          {{ artifact.operationId }}
        </span>
        <span v-if="artifact.draft" class="ml-1 text-body-2 text--disabled" >
          <i>(Draft)</i>
        </span>
        <span class="ml-3 font-weight-light text-caption">
          /{{ artifact.path }}
        </span>
        <v-tooltip bottom v-if="!isReadOnly">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                rounded
                icon
                v-bind="attrs"
                v-on="on"
                class="ml-2"
                :disabled="isParentLoading"
                @click="copyPathToClipboard"
            >
              <v-btn icon x-small>
                <v-icon small>fas fa-copy</v-icon>
              </v-btn>
            </v-btn>
          </template>
          <span>Copy path to clipboard</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip bottom v-if="!isReadOnly">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                rounded
                icon
                v-bind="attrs"
                v-on="on"
                :disabled="isParentLoading"
                @click="invokeDeletion"
            >
              <v-icon small>fas fa-trash-alt</v-icon>
            </v-btn>
          </template>
          <span>Delete Request</span>
        </v-tooltip>
        <v-tooltip bottom v-if="!isReadOnly">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                rounded
                icon
                v-bind="attrs"
                v-on="on"
                :disabled="isParentLoading"
                @click="invokeEditor"
            >
              <v-icon small>fa fa-cog</v-icon>
            </v-btn>
          </template>
          <span>Edit Request</span>
        </v-tooltip>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
    </v-card-text>
    <v-dialog
        v-model="isDeleting"
        width="500"
        overlay-color="black"
    >
      <v-card :loading="isSendingDeleteRequest">
        <v-card-title class="headline">
          Delete HTTP API Request
        </v-card-title>
        <v-card-text>
          Would you like to delete the <b>{{ artifact.operationId }}</b> HTTP API request? This action is irreversible
          and will
          show up on the events tab of this HTTP API.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green"
              text
              @click="deleteEntry"
          >
            DELETE ENTRY
          </v-btn>
          <v-btn
              color="red"
              text
              @click="isDeleting = false"
          >
            CANCEL
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {Watch} from "vue-property-decorator";
import ObjectDictionaryAPI from "@/domains/artifacts/objectDictionary/ObjectDictionaryAPI";
import {AxiosError, AxiosResponse} from "axios";
import RequestBody from "@/domains/artifacts/httpAPI/RequestBody";
import RequestHeader from "@/domains/artifacts/httpAPI/RequestHeader";
import RequestResponse from "@/domains/artifacts/httpAPI/RequestResponse";
import PathArgument from "@/domains/artifacts/httpAPI/PathArgument";
import HttpAPIRequestPOTO from "@/domains/artifacts/httpAPI/HttpAPIRequestPOTO";
import HttpAPIAPI from "@/domains/artifacts/httpAPI/HttpAPIAPI";

const DictionaryEntryListItemProps = Vue.extend({
  props: {
    httpApi: Object,
    readOnly: Boolean,
    callEditor: Object,
    isLoading: Boolean,
  }
});

@Component
export default class DictionaryEntryListItem extends DictionaryEntryListItemProps {

  isDeleting: boolean = false;
  isSendingDeleteRequest: boolean = false;

  selectedMenuItemIndex: number = 0;

  requestBodies: Array<RequestBody> = [];
  requestHeaders: Array<RequestHeader> = [];
  requestResponses: Array<RequestResponse> = [];
  requestArguments: Array<PathArgument> = [];

  mounted() {
    this.requestBodies = <Array<RequestBody>>JSON.parse(this.artifact.requestBodies);
    this.requestHeaders = <Array<RequestHeader>>JSON.parse(this.artifact.headers);
    this.requestResponses = <Array<RequestResponse>>JSON.parse(this.artifact.responses);
    this.requestArguments = <Array<PathArgument>>JSON.parse(this.artifact.parameters);
  }

  getDescription() {
    if (!this.artifact.description || this.artifact.description.length == 0)
      return "No description was provided to this request. What a shame, don't you think? 😔";
    return this.artifact.description;
  }

  private deleteEntry() {
    this.isSendingDeleteRequest = true;
    new HttpAPIAPI().deleteRequest(
        <string>this.$route.params.projectId,
        <string>this.$route.params.applicationId,
        <string>this.artifact?.httpApiId,
        this.artifact.httpRequestId
    ).then((response: AxiosResponse) => {
      this.isDeleting = false;
      this.$emit("onDeleted");
    }).catch((error: AxiosError) => {
    }).finally(() => {
      this.isSendingDeleteRequest = false;
    })
  }

  copyPathToClipboard() {
    navigator.clipboard.writeText(`/${this.artifact.path}`);
  }

  private invokeDeletion() {
    this.isDeleting = true;
  }

  private invokeEditor() {
    this.$emit("callEditor", this.artifact);
  }

  get isParentLoading(): boolean {
    return this.isLoading;
  }

  get artifact(): HttpAPIRequestPOTO {
    return this.httpApi;
  }

  get isReadOnly(): boolean {
    return this.readOnly;
  }

  get methodLabelClass() : string {
    switch(this.artifact.method){
      case "POST":
        return "green--text"
      case "GET":
        return "blue--text"
      case "DELETE":
        return "red--text"
      case "PUT":
        return "orange--text"
      case "PATCH":
        return "yellow--text"
      case "HEAD":
        return "purple--text"
      case "OPTION":
        return "cyan--text"
    }
  }

}

</script>

<style scoped>

.my-editor {
  background: #2d2d2d;
  color: #ccc;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

</style>