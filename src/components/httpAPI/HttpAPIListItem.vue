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
        <span v-if="artifact.draft" class="ml-1 text-body-2 text--disabled">
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
              <v-icon small>fas fa-copy</v-icon>
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
    <v-card-text style="margin-bottom: -12px; margin-top: -12px;">
      <v-row class="mt-3" dense v-if="cardExpanded">

        <v-tabs fixed-tabs>
          <v-tab>
            Info
          </v-tab>
          <v-tab>
            Try-it
          </v-tab>
          <v-tab-item>
            <v-row>

            </v-row>
            <v-tabs vertical>
              <v-tab>
                Arguments ({{ requestArguments.length }})
              </v-tab>
              <v-tab>
                Headers ({{ requestHeaders.length }})
              </v-tab>
              <v-tab>
                Bodies ({{ requestBodies.length }})
              </v-tab>
              <v-tab>
                Responses ({{ requestResponses.length }})
              </v-tab>

              <v-tab-item>
                <v-row no-gutters>
                  <v-row class="mt-2" justify="center" v-if="requestArguments.length === 0">
                    <p class="text--secondary">No path arguments provided for this request</p>
                  </v-row>
                  <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(pathArgument, i) in requestArguments"
                        :key="i"
                    >
                      <v-expansion-panel-header>
                        <span>
                        {{ pathArgument.label }} ({{ pathArgument.name }})
                        </span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row no-gutters>
                          <v-col cols="6">
                            <v-text-field
                                label="Label"
                                class="mr-2"
                                dense
                                outlined
                                disabled
                                :value="pathArgument.label"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                                label="Name"
                                class="mr-2"
                                dense
                                outlined
                                disabled
                                :value="pathArgument.name"
                            />
                          </v-col>
                        </v-row>
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-textarea
                                label="Argument Description"
                                auto-grow
                                rows="3"
                                disabled
                                outlined
                                :value="pathArgument.description ? pathArgument.description : 'No description provided'"
                            />
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-row class="mt-2" justify="center" v-if="requestHeaders.length === 0">
                    <p class="text--secondary">No header provided for this request</p>
                  </v-row>
                  <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(header, i) in requestHeaders"
                        :key="i"
                    >
                      <v-expansion-panel-header>
                        <span>
                        {{ header.label }} ({{ header.name }})
                        </span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row no-gutters>
                          <v-col cols="6">
                            <v-text-field
                                label="Label"
                                class="mr-2"
                                dense
                                disabled
                                outlined
                                :value="header.label"
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                                label="Name"
                                class="mr-2"
                                dense
                                disabled
                                outlined
                                :value="header.name"
                            />
                          </v-col>
                        </v-row>
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-text-field
                                label="Default Value"
                                class="mr-2"
                                dense
                                disabled
                                outlined
                                :value="header.defaultValue"
                            />
                          </v-col>
                        </v-row>
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-textarea
                                label="Header Description"
                                auto-grow
                                rows="3"
                                outlined
                                disabled
                                :value="header.description ? header.description : 'No description provided'"
                            />
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-row class="mt-2" justify="center" v-if="requestBodies.length === 0">
                    <p class="text--secondary">No request bodies provided for this request</p>
                  </v-row>
                  <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(requestBody, i) in requestBodies"
                        :key="i"
                    >
                      <v-expansion-panel-header>
                        <span>{{ requestBody.label }}</span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row no-gutters>
                          <v-col cols="4">
                            <v-text-field
                                label="Label"
                                class="mr-2"
                                dense
                                disabled
                                outlined
                                :value="requestBody.label"
                            />
                            <v-textarea
                                label="Request Body Description"
                                auto-grow
                                rows="4"
                                disabled
                                persistent-hint
                                outlined
                                :value="requestBody.description"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="8">
                            <prism-editor
                                class="ml-3 my-editor"
                                :value="requestBody.structure"
                                :highlight="getEditorHighlighterForRequestBody(i)"
                                line-numbers
                                readonly
                            />
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-row class="mt-2" justify="center" v-if="requestResponses.length === 0">
                    <p class="text--secondary">No request response provided for this request</p>
                  </v-row>
                  <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(response, i) in requestResponses"
                        :key="i"
                    >
                      <v-expansion-panel-header>
                        <span>{{ response.label }} ({{ response.code }}) </span>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row no-gutters>
                          <v-col cols="4">
                            <v-text-field
                                label="Label"
                                dense
                                disabled
                                outlined
                                :value="response.label"
                            />
                            <v-text-field
                                label="Response CODE"
                                dense
                                type="number"
                                outlined
                                disabled
                                :value="response.code"
                            />
                            <v-textarea
                                label="Response Description"
                                auto-grow
                                rows="4"
                                outlined
                                disabled
                                :value="response.description"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="8">
                            <prism-editor
                                class="ml-3 my-editor"
                                :value="response.structure"
                                :highlight="getEditorHighlighterForResponse(i)"
                                line-numbers
                                readonly
                            />
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </v-tab-item>

            </v-tabs>
          </v-tab-item>
        </v-tabs>

      </v-row>
      <v-row align="center" justify="center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                rounded
                icon
                v-bind="attrs"
                v-on="on"
                class="ml-2"
                :disabled="isParentLoading"
                @click="cardExpanded = !cardExpanded"
            >
              <v-icon v-if="cardExpanded" small>fas fa-angle-double-up</v-icon>
              <v-icon v-if="!cardExpanded" small>fas fa-angle-double-down</v-icon>
            </v-btn>
          </template>
          <span v-if="!cardExpanded">Expand</span>
          <span v-if="cardExpanded">Retract</span>
        </v-tooltip>
      </v-row>
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
import Prism, {highlight} from "prismjs";
import {PrismEditor} from "vue-prism-editor";

const DictionaryEntryListItemProps = Vue.extend({
  components: {
    PrismEditor
  },
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

  cardExpanded: boolean = false;

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

  get methodLabelClass(): string {
    switch (this.artifact.method) {
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

  getEditorHighlighterForRequestBody(requestBodyIndex: number) {
    const code: string = this.requestBodies[requestBodyIndex].structure;
    return () => {
      return highlight(code, Prism.languages.javascript, 'javascript');
    }
  }

  getEditorHighlighterForResponse(responseIndex: number) {
    const code: string = this.requestResponses[responseIndex].structure;
    return () => {
      return highlight(code, Prism.languages.javascript, 'javascript');
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