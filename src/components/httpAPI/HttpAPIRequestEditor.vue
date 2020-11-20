<template>
  <v-container fluid class="mx-5">
    <v-row v-if="!isBootstrapping" justify="space-between" align="center">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              @click="closeCreator"
              v-on="on"
              v-bind="attrs">
            <v-icon>fas fa-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Return</span>
      </v-tooltip>
      <h3 class="font-weight-light">Edit HTTP Request</h3>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              :color="getColorForSaveButton()"
              :disabled="hasRequestInconsistencies()"
              @click="saveHttpAPIRequest"
              v-on="on"
              v-bind="attrs">
            <v-icon small>fas fa-check</v-icon>
          </v-btn>
        </template>
        <span>{{ getSaveButtonTooltip() }}</span>
      </v-tooltip>
    </v-row>
    <v-row class="mt-3 mb-5">
      <v-divider/>
    </v-row>
    <v-alert
        color="red"
        dense
        v-model="hasErrors"
        outlined
        text
        dismissible
        type="warning"
    >{{ errorMessage }}
    </v-alert>
    <v-row>
      <v-col cols="6">
        <v-text-field
            label="Operation ID"
            dense
            persistent-hint
            hint="This field serves as an string based identifier so you can query this request more easily."
            outlined
            v-model="httpAPIRequestToEdit.operationId"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-switch
            style="margin-top: 6px;"
            v-model="httpAPIRequestToEdit.draft"
            inset
            :true-value="false"
            :false-value="true"
            :label="httpAPIRequestToEdit.draft ? 'Draft' : 'Published'"
        ></v-switch>
      </v-col>
      <v-col cols="3">
        <v-switch
            style="margin-top: 6px;"
            v-model="httpAPIRequestToEdit.deprecated"
            inset
            :label="httpAPIRequestToEdit.deprecated ? 'Deprecated' : 'Not Deprecated'"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-autocomplete
            label="Method"
            hide-details
            v-model="httpAPIRequestToEdit.method"
            :items="['GET','POST','PUT','DELETE','HEAD','OPTIONS','PATCH',]"
            dense
            outlined
        />
      </v-col>
      <v-col cols="9">
        <v-text-field
            label="Path"
            class="mr-2"
            dense
            persistent-hint
            hint="The URL of your resource"
            outlined
            prefix="https://your-base-url.com/"
            v-model="httpAPIRequestToEdit.path"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
            label="Request description"
            auto-grow
            persistent-hint
            rows="3"
            hint="Describe the purpose of this HTTP request"
            outlined
            v-model="httpAPIRequestToEdit.description"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-tabs
        v-model="selectedTab"
        fixed-tabs>
      <v-tab>
        {{ getArgumentsLabel() }}
      </v-tab>
      <v-tab>
        {{ getHeadersLabel() }}
      </v-tab>
      <v-tab>
        {{ getBodiesLabel() }}
      </v-tab>
      <v-tab>
        {{ getResponsesLabel() }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="selectedTab">
      <!--  PATH ARGUMENTS  -->
      <v-tab-item>
        <v-container>
          <v-row justify="space-between" align="baseline" class="px-3">
            <h4 class="font-weight-light">Path Arguments</h4>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    @click="addNewPathArgument"
                    v-on="on"
                    v-bind="attrs">
                  <v-icon small>fas fa-plus</v-icon>
                </v-btn>
              </template>
              <span>Add Path Argument</span>
            </v-tooltip>
          </v-row>
          <v-row class="mt-0 mb-1">
            <v-divider/>
          </v-row>
          <v-row>
            <v-row class="mt-2" justify="center" v-if="pathArguments.length === 0">
              <p class="text--secondary">No path arguments provided for this request</p>
            </v-row>
            <v-expansion-panels>
              <v-expansion-panel
                  v-for="(pathArgument, i) in pathArguments"
                  :key="i"
              >
                <v-expansion-panel-header disable-icon-rotate>
            <span>
            {{ pathArgument.label }} ({{ pathArgument.name }})
              <span v-if="pathArgument.name.length > 0 && !httpAPIRequestToEdit.path.includes(`{${pathArgument.name}}`)"
                    class="red--text">
                Invalid
              </span>
            </span>
                  <template v-slot:actions>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            class="mr-3"
                            icon
                            @click="removePathArgument(i)"
                            v-on="on"
                            v-bind="attrs">
                          <v-icon small>fas fa-trash</v-icon>
                        </v-btn>
                      </template>
                      <span>Remove Path Argument</span>
                    </v-tooltip>
                    <v-icon>
                      $expand
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters class="mb-2"
                         v-if="pathArgument.name.length > 0 && !httpAPIRequestToEdit.path.includes(`{${pathArgument.name}}`)">
                    <v-col cols="12">
              <span class="text-caption red--text">
                Invalid argument name: Request path does not include
                {{ getNonexistentPathNameString(pathArgument.name) }}
              </span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="6">
                      <v-text-field
                          label="Label"
                          class="mr-2"
                          dense
                          outlined
                          v-model="pathArgument.label"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                          label="Name"
                          class="mr-2"
                          dense
                          outlined
                          v-model="pathArgument.name"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-textarea
                          label="Path Argument Description"
                          auto-grow
                          persistent-hint
                          rows="3"
                          hint="Describe the meaning of this path argument"
                          outlined
                          v-model="pathArgument.description"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-container>
      </v-tab-item>
      <!--  HEADERS  -->
      <v-tab-item>
        <v-container>
          <v-row justify="space-between" align="baseline" class="px-3">
            <h4 class="font-weight-light">Headers</h4>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    @click="addNewRequestHeader"
                    v-on="on"
                    v-bind="attrs">
                  <v-icon small>fas fa-plus</v-icon>
                </v-btn>
              </template>
              <span>Add Header</span>
            </v-tooltip>
          </v-row>
          <v-row class="mt-0 mb-1">
            <v-divider/>
          </v-row>
          <v-row>
            <v-row class="mt-2" justify="center" v-if="requestHeaders.length === 0">
              <p class="text--secondary">No header provided for this request</p>
            </v-row>
            <v-expansion-panels>
              <v-expansion-panel
                  v-for="(header, i) in requestHeaders"
                  :key="i"
              >
                <v-expansion-panel-header disable-icon-rotate>
            <span>
            {{ header.label }} ({{ header.name }})
            </span>
                  <template v-slot:actions>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            class="mr-3"
                            icon
                            @click="removeRequestHeader(i)"
                            v-on="on"
                            v-bind="attrs">
                          <v-icon small>fas fa-trash</v-icon>
                        </v-btn>
                      </template>
                      <span>Remove Header</span>
                    </v-tooltip>
                    <v-icon>
                      $expand
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="6">
                      <v-text-field
                          label="Label"
                          class="mr-2"
                          dense
                          outlined
                          v-model="header.label"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                          label="Name"
                          class="mr-2"
                          dense
                          outlined
                          v-model="header.name"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-text-field
                          label="Default Value"
                          class="mr-2"
                          dense
                          outlined
                          v-model="header.defaultValue"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-textarea
                          label="Header Description"
                          auto-grow
                          persistent-hint
                          rows="3"
                          hint="Describe the meaning of this header"
                          outlined
                          v-model="header.description"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-container>
      </v-tab-item>
      <!--  REQUEST BODIES  -->
      <v-tab-item>
        <v-container>
          <v-row justify="space-between" align="baseline" class="px-3">
            <h4 class="font-weight-light">Request Bodies</h4>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    @click="addNewRequestBody"
                    v-on="on"
                    v-bind="attrs">
                  <v-icon small>fas fa-plus</v-icon>
                </v-btn>
              </template>
              <span>Add Request Body</span>
            </v-tooltip>
          </v-row>
          <v-row class="mt-0 mb-1">
            <v-divider/>
          </v-row>
          <v-row>
            <v-row class="mt-2" justify="center" v-if="requestBodies.length === 0">
              <p class="text--secondary">No request bodies provided for this request</p>
            </v-row>
            <v-expansion-panels>
              <v-expansion-panel
                  v-for="(requestBody, i) in requestBodies"
                  :key="i"
              >
                <v-expansion-panel-header disable-icon-rotate>
                  <span>{{ requestBody.label }}</span>
                  <template v-slot:actions>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            class="mr-3"
                            icon
                            @click="removeRequestBody(i)"
                            v-on="on"
                            v-bind="attrs">
                          <v-icon small>fas fa-trash</v-icon>
                        </v-btn>
                      </template>
                      <span>Remove Request Body</span>
                    </v-tooltip>
                    <v-icon>
                      $expand
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="4">
                      <v-text-field
                          label="Label"
                          class="mr-2"
                          dense
                          outlined
                          v-model="requestBody.label"
                      />
                      <v-textarea
                          label="Request Body Description"
                          auto-grow
                          rows="4"
                          persistent-hint
                          hint="Describe how this request body differs from others."
                          outlined
                          v-model="requestBody.description"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="8">
                      <prism-editor
                          class="ml-3 my-editor"
                          v-model="requestBody.structure"
                          :highlight="getEditorHighlighterForRequestBody(i)"
                          line-numbers
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-container>
      </v-tab-item>
      <!--  RESPONSES  -->
      <v-tab-item>
        <v-container>
          <v-row justify="space-between" align="baseline" class="px-3">
            <h4 class="font-weight-light">Request Responses</h4>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    @click="addNewRequestResponse"
                    v-on="on"
                    v-bind="attrs">
                  <v-icon small>fas fa-plus</v-icon>
                </v-btn>
              </template>
              <span>Add Request Response</span>
            </v-tooltip>
          </v-row>
          <v-row class="mt-0 mb-1">
            <v-divider/>
          </v-row>
          <v-row>
            <v-row class="mt-2" justify="center" v-if="requestResponses.length === 0">
              <p class="text--secondary">No request response provided for this request</p>
            </v-row>
            <v-expansion-panels>
              <v-expansion-panel
                  v-for="(response, i) in requestResponses"
                  :key="i"
              >
                <v-expansion-panel-header disable-icon-rotate>
                  <span>{{ response.label }} ({{ response.code }}) </span>
                  <template v-slot:actions>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            class="mr-3"
                            icon
                            @click="removeRequestResponse(i)"
                            v-on="on"
                            v-bind="attrs">
                          <v-icon small>fas fa-trash</v-icon>
                        </v-btn>
                      </template>
                      <span>Remove Request Response</span>
                    </v-tooltip>
                    <v-icon>
                      $expand
                    </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col cols="4">
                      <v-text-field
                          label="Label"
                          dense
                          outlined
                          v-model="response.label"
                      />
                      <v-text-field
                          label="Response CODE"
                          dense
                          type="number"
                          outlined
                          v-model="response.code"
                      />
                      <v-textarea
                          label="Response Description"
                          auto-grow
                          rows="4"
                          persistent-hint
                          hint="Describe the reason this response was returned from the server."
                          outlined
                          v-model="response.description"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="8">
                      <prism-editor
                          class="ml-3 my-editor"
                          v-model="response.structure"
                          :highlight="getEditorHighlighterForResponse(i)"
                          line-numbers
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";
import {AxiosError, AxiosResponse} from "axios";
import ExceptionCommons from "@/domains/framework/ExceptionCommons";
import HttpAPIPOTO from "@/domains/artifacts/httpAPI/HttpAPIPOTO";
import HttpAPIRequestPOTO from "@/domains/artifacts/httpAPI/HttpAPIRequestPOTO";
import HttpAPIAPI from "@/domains/artifacts/httpAPI/HttpAPIAPI";

import {PrismEditor} from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';

import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import Prism, {highlight} from "prismjs";
import PathArgument from "@/domains/artifacts/httpAPI/PathArgument";
import RequestBody from "@/domains/artifacts/httpAPI/RequestBody";
import RequestResponse from "@/domains/artifacts/httpAPI/RequestResponse";
import RequestHeader from "@/domains/artifacts/httpAPI/RequestHeader";

const HttpAPIRequestEditorProps = Vue.extend({
  components: {
    PrismEditor
  },
  props: {
    httpApi: Object,
    httpApiRequest: Object,
  }
});

@Component
export default class HttpAPIRequestCreator extends HttpAPIRequestEditorProps {

  selectedTab: any = '';

  isLoading: boolean = false;
  hasErrors: boolean = false;
  errorMessage: string = "";
  isBootstrapping: boolean = true;

  currentHttpAPI: HttpAPIPOTO | null = null;
  httpAPIRequestToEdit: HttpAPIRequestPOTO = new HttpAPIRequestPOTO();

  pathArguments: Array<PathArgument> = new Array<PathArgument>();
  requestBodies: Array<RequestBody> = new Array<RequestBody>();
  requestResponses: Array<RequestResponse> = new Array<RequestResponse>();
  requestHeaders: Array<RequestHeader> = new Array<RequestHeader>();

  mounted() {
    this.currentHttpAPI = this.httpApi;
    this.httpAPIRequestToEdit = this.httpApiRequest;
    this.isBootstrapping = false;

    this.pathArguments = <Array<PathArgument>>JSON.parse(this.httpAPIRequestToEdit.parameters);
    this.requestBodies = <Array<RequestBody>>JSON.parse(this.httpAPIRequestToEdit.requestBodies);
    this.requestResponses = <Array<RequestResponse>>JSON.parse(this.httpAPIRequestToEdit.responses);
    this.requestHeaders = <Array<RequestHeader>>JSON.parse(this.httpAPIRequestToEdit.headers);

  }

  getColorForSaveButton(): string {
    if (this.httpRequestIsInvalid()) return "red";
    return "green"
  }

  hasRequestInconsistencies(): boolean {
    return this.httpRequestIsInvalid();
  }

  saveHttpAPIRequest() {
    this.isLoading = true;
    this.hasErrors = false;
    const httpAPIRequest: HttpAPIRequestPOTO = this.buildHttpAPIRequest();
    console.log(httpAPIRequest);
    new HttpAPIAPI().updateHttpAPIRequest(
        <string>this.$route.params.projectId,
        <string>this.$route.params.applicationId,
        <string>this.currentHttpAPI?.httpApiId,
        httpAPIRequest
    ).then((response: AxiosResponse<HttpAPIRequestPOTO>) => {
      this.$emit("onEdited");
    }).catch((error: AxiosError) => {
      this.hasErrors = true;
      this.errorMessage = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  private buildHttpAPIRequest(): HttpAPIRequestPOTO {
    let httpAPIRequest = this.httpAPIRequestToEdit;
    httpAPIRequest.parameters = JSON.stringify(this.pathArguments);
    httpAPIRequest.headers = JSON.stringify(this.requestHeaders);
    httpAPIRequest.requestBodies = JSON.stringify(this.requestBodies);
    httpAPIRequest.responses = JSON.stringify(this.requestResponses);
    httpAPIRequest.httpApiId = <string>this.currentHttpAPI?.httpApiId;
    return httpAPIRequest;
  }

  getSaveButtonTooltip(): string {
    if (this.httpAPIRequestToEdit.operationId.length == 0)
      return "Please add an operation id for this request.";
    return "Save"
  }

  httpRequestIsInvalid(): boolean {
    if (this.httpAPIRequestToEdit.operationId.length == 0)
      return true;
    return false;
  }

  getNonexistentPathNameString(pathVariableName: string): string {
    return `{${pathVariableName}}`;
  }

  addNewPathArgument() {
    this.pathArguments.push(new PathArgument());
  }

  removePathArgument(pathIndex: number) {
    this.pathArguments.splice(pathIndex, 1);
  }

  addNewRequestBody() {
    this.requestBodies.push(new RequestBody());
  }

  removeRequestBody(requestBodyIndex: number) {
    this.requestBodies.splice(requestBodyIndex, 1);
  }

  addNewRequestResponse() {
    this.requestResponses.push(new RequestResponse());
  }

  removeRequestResponse(requestResponseIndex: number) {
    this.requestResponses.splice(requestResponseIndex, 1);
  }

  addNewRequestHeader() {
    this.requestHeaders.push(new RequestHeader());
  }

  removeRequestHeader(requestHeaderIndex: number) {
    this.requestHeaders.splice(requestHeaderIndex, 1);
  }

  closeCreator() {
    this.$emit("close")
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

  getArgumentsLabel(): string {
    return `Arguments (${this.pathArguments.length})`;
  }

  getHeadersLabel(): string {
    return `Headers (${this.requestHeaders.length})`;
  }

  getBodiesLabel(): string {
    return `Bodies (${this.requestBodies.length})`;
  }

  getResponsesLabel(): string {
    return `Responses (${this.requestResponses.length})`;
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