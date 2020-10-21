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
      <h3 class="font-weight-light">Edit Entry</h3>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              :color="getColorForSaveButton()"
              :disabled="hasClassInconsistencies()"
              @click="updateDictionaryEntry"
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
      <v-text-field
          label="Entry Name"
          dense
          persistent-hint
          hint="Give your entry a well-defined, unambiguous name. Remember what uncle Bob said 😉"
          outlined
          v-model="dictionaryEntry.name"
      ></v-text-field>
    </v-row>
    <v-row class="mt-3">
      <v-textarea
          label="Entry Description"
          auto-grow
          persistent-hint
          hint="Describe the motive for this class' existence. You might want to explain its responsibility as well"
          outlined
          v-model="dictionaryEntry.description"
      ></v-textarea>
    </v-row>
    <!--  CONSTRUCTORS  -->
    <v-row justify="space-between" align="baseline" class="mt-3">
      <h4 class="font-weight-light">Constructors</h4>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              @click="addNewConstructor"
              v-on="on"
              v-bind="attrs">
            <v-icon small>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Add Constructor</span>
      </v-tooltip>
    </v-row>
    <v-row class="mt-0 mb-1">
      <v-divider/>
    </v-row>
    <v-row>
      <v-row class="mt-2" justify="center" v-if="dictionaryEntryConstructors.length === 0">
        <p class="text--secondary">No constructors provided for this class</p>
      </v-row>
      <v-expansion-panels>
        <v-expansion-panel
            v-for="(constructor, i) in dictionaryEntryConstructors"
            :key="i"
        >
          <v-expansion-panel-header disable-icon-rotate>
            <span
                :class="{ 'text-caption': getConstructorLabel(constructor).length > 70, 'text-body': getConstructorLabel(constructor).length < 70}">
            {{ getConstructorLabel(constructor) }}
            </span>
            <template v-slot:actions>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      class="mr-3"
                      icon
                      @click="removeMethod(i)"
                      v-on="on"
                      v-bind="attrs">
                    <v-icon small>fas fa-trash</v-icon>
                  </v-btn>
                </template>
                <span>Remove Method</span>
              </v-tooltip>
              <v-icon>
                $expand
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row class="mt-3">
              <v-autocomplete
                  label="Visibility"
                  hide-details
                  v-model="constructor.visibility"
                  :items="[
                      'Public',
                      'Private',
                      'Protected',
                      ]"
                  dense
                  outlined
              ></v-autocomplete>
            </v-row>
            <v-row class="mt-3">
              <v-textarea
                  label="Constructor Description"
                  auto-grow
                  persistent-hint
                  hint="Describe when this constructor should be used instead of others"
                  outlined
                  v-model="constructor.description"
              ></v-textarea>
            </v-row>
            <v-row class="mt-2" dense justify="space-between">
              <h5 class="font-weight-light">Arguments</h5>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      @click="addNewArgumentToConstructor(constructor)"
                      v-on="on"
                      v-bind="attrs">
                    <v-icon x-small>fas fa-plus</v-icon>
                  </v-btn>
                </template>
                <span>Add Argument</span>
              </v-tooltip>
            </v-row>
            <v-row class="text-caption text--secondary" justify="center" v-if="constructor.arguments.length === 0">
              <p>No arguments provided for this constructor</p>
            </v-row>
            <v-container v-for="(argument, j) in constructor.arguments" :key="j">
              <v-row align="baseline" justify="space-between">
                <v-text-field
                    label="Argument name"
                    dense
                    hide-details
                    outlined
                    class="ml-2"
                    v-model="argument.label"
                ></v-text-field>
                <v-autocomplete
                    label="Type"
                    hide-details
                    v-model="argument.type"
                    :items="[
                      'Integer',
                      'Float',
                      'String',
                      'Boolean',
                      ]"
                    dense
                    outlined
                    class="ml-2"
                ></v-autocomplete>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="ml-2"
                        icon
                        @click="removeConstructorArgument(i, j)"
                        v-on="on"
                        v-bind="attrs">
                      <v-icon x-small>fas fa-minus</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove argument</span>
                </v-tooltip>
              </v-row>
              <v-row align="start" justify="space-around">
                <v-checkbox
                    v-model="argument.isArray"
                    label="Array"
                    dense
                ></v-checkbox>
                <v-checkbox
                    v-model="argument.isNullable"
                    label="Nullable"
                    dense
                ></v-checkbox>
              </v-row>
              <v-row>
                <v-divider/>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <!--  METHODS  -->
    <v-row justify="space-between" align="baseline" class="mt-3">
      <h4 class="font-weight-light">Methods</h4>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              @click="addNewMethod"
              v-on="on"
              v-bind="attrs">
            <v-icon small>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Add Method</span>
      </v-tooltip>
    </v-row>
    <v-row class="mt-0 mb-1">
      <v-divider/>
    </v-row>
    <v-row>
      <v-row class="mt-2" justify="center" v-if="dictionaryEntryMethods.length === 0">
        <p class="text--secondary">No methods provided for this class</p>
      </v-row>
      <v-expansion-panels>
        <v-expansion-panel
            v-for="(method, i) in dictionaryEntryMethods"
            :key="i"
        >
          <v-expansion-panel-header disable-icon-rotate>
            <span
                :class="{ 'text-caption': getMethodLabel(method).length > 70, 'text-body': getMethodLabel(method).length < 70}">
              {{ getMethodLabel(method) }}
            </span>
            <template v-slot:actions>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      class="mr-3"
                      icon
                      @click="removeMethod(i)"
                      v-on="on"
                      v-bind="attrs">
                    <v-icon small>fas fa-trash</v-icon>
                  </v-btn>
                </template>
                <span>Remove Method</span>
              </v-tooltip>
              <v-icon>
                $expand
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row class="mt-3">
              <v-text-field
                  label="Method name"
                  persistent-hint
                  hint="Give your method a nice name, something very descriptive."
                  outlined
                  dense
                  v-model="method.name"
              ></v-text-field>
              <v-autocomplete
                  label="Visibility"
                  hide-details
                  v-model="method.visibility"
                  :items="[
                      'Public',
                      'Private',
                      'Protected',
                      ]"
                  dense
                  outlined
                  class="ml-2"
              ></v-autocomplete>
            </v-row>
            <v-row class="mt-3">
              <v-textarea
                  label="Method Description"
                  auto-grow
                  persistent-hint
                  hint="Describe the purpose of this method"
                  outlined
                  v-model="method.description"
              ></v-textarea>
            </v-row>
            <v-row align="center" class="mt-3">
              <v-autocomplete
                  label="Return type"
                  hide-details
                  v-model="method.returnType"
                  :items="[
                      'Void',
                      'Integer',
                      'Float',
                      'String',
                      'Boolean',
                      ]"
                  dense
                  outlined
                  class="ml-2"
              ></v-autocomplete>
              <v-checkbox class="mx-5" v-model="method.isStatic" label="Static"/>
            </v-row>
            <v-row class="mt-2" dense justify="space-between">
              <h5 class="font-weight-light">Arguments</h5>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      @click="addNewArgumentToMethod(method)"
                      v-on="on"
                      v-bind="attrs">
                    <v-icon x-small>fas fa-plus</v-icon>
                  </v-btn>
                </template>
                <span>Add Argument</span>
              </v-tooltip>
            </v-row>
            <v-row class="text-caption text--secondary" justify="center" v-if="method.arguments.length === 0">
              <p>No arguments provided for this method</p>
            </v-row>
            <v-container v-for="(argument, j) in method.arguments" :key="j">
              <v-row align="baseline" justify="space-between">
                <v-text-field
                    label="Argument name"
                    dense
                    hide-details
                    outlined
                    class="ml-2"
                    v-model="argument.label"
                ></v-text-field>
                <v-autocomplete
                    label="Type"
                    hide-details
                    v-model="argument.type"
                    :items="[
                      'Integer',
                      'Float',
                      'String',
                      'Boolean',
                      ]"
                    dense
                    outlined
                    class="ml-2"
                ></v-autocomplete>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="ml-2"
                        icon
                        @click="removeMethodArgument(i, j)"
                        v-on="on"
                        v-bind="attrs">
                      <v-icon x-small>fas fa-minus</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove argument</span>
                </v-tooltip>
              </v-row>
              <v-row align="start" justify="space-around">
                <v-checkbox
                    v-model="argument.isArray"
                    label="Array"
                    dense
                ></v-checkbox>
                <v-checkbox
                    v-model="argument.isNullable"
                    label="Nullable"
                    dense
                ></v-checkbox>
              </v-row>
              <v-row>
                <v-divider/>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <!-- PROPERTIES  -->
    <v-row justify="space-between" align="baseline" class="mt-3">
      <h4 class="font-weight-light">Properties</h4>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              @click="addNewProperty"
              v-on="on"
              v-bind="attrs">
            <v-icon small>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Add Property</span>
      </v-tooltip>
    </v-row>
    <v-row class="mt-0 mb-1">
      <v-divider/>
    </v-row>
    <v-row>
      <v-row class="mt-2" justify="center" v-if="dictionaryEntryProperties.length === 0">
        <p class="text--secondary">No properties provided for this class</p>
      </v-row>
      <v-expansion-panels>
        <v-expansion-panel
            v-for="(property, i) in dictionaryEntryProperties"
            :key="i"
        >
          <v-expansion-panel-header disable-icon-rotate>
            <span
                :class="{ 'text-caption': getPropertyLabel(property).length > 70, 'text-body': getPropertyLabel(property).length < 70}">
              {{ getPropertyLabel(property) }}
            </span>
            <template v-slot:actions>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      class="mr-3"
                      icon
                      @click="removeProperty(i)"
                      v-on="on"
                      v-bind="attrs">
                    <v-icon small>fas fa-trash</v-icon>
                  </v-btn>
                </template>
                <span>Remove Property</span>
              </v-tooltip>
              <v-icon>
                $expand
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row class="mt-3">
              <v-text-field
                  label="Property name"
                  outlined
                  dense
                  v-model="property.name"
              ></v-text-field>
              <v-autocomplete
                  label="Visibility"
                  hide-details
                  v-model="property.visibility"
                  :items="[
                      'Public',
                      'Private',
                      'Protected',
                      ]"
                  dense
                  outlined
                  class="ml-2"
              ></v-autocomplete>
            </v-row>
            <v-row>
              <v-textarea
                  label="Property Description"
                  auto-grow
                  persistent-hint
                  hint="Describe the purpose of this property"
                  outlined
                  v-model="property.description"
              ></v-textarea>
            </v-row>
            <v-row align="center" class="mt-3">
              <v-autocomplete
                  label="Type"
                  hide-details
                  v-model="property.type"
                  :items="[
                      'Integer',
                      'Float',
                      'String',
                      'Boolean',
                      ]"
                  dense
                  outlined
                  class="ml-2"
              ></v-autocomplete>
              <v-checkbox class="mx-5" v-model="property.isStatic" label="Static"/>
              <v-checkbox class="mx-5" v-model="property.isFinal" label="Final"/>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";
import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";
import ObjectDictionaryEntryCommons from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryCommons";
import ClassConstructor from "@/domains/artifacts/objectDictionary/ClassConstructor";
import ClassMethod from "@/domains/artifacts/objectDictionary/ClassMethod";
import ClassProperty from "@/domains/artifacts/objectDictionary/ClassProperty";
import PropertyType from "@/domains/artifacts/objectDictionary/PropertyType";
import ObjectDictionaryAPI from "@/domains/artifacts/objectDictionary/ObjectDictionaryAPI";
import {AxiosError, AxiosResponse} from "axios";
import ExceptionCommons from "@/domains/framework/ExceptionCommons";
import ClassStructure from "@/domains/artifacts/objectDictionary/ClassStructure";
import {IntentResult} from "@/store/modules/Intents";
import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";

const DictionaryEntryEditorProps = Vue.extend({
  props: {
    objectDictionaryEntry: Object,
  }
});

@Component
export default class DictionaryEntryEditor extends DictionaryEntryEditorProps {

  isLoading: boolean = false;
  hasErrors: boolean = false;
  errorMessage: string = "";
  isBootstrapping: boolean = true;

  dictionaryEntry: ObjectDictionaryEntryPOTO = new ObjectDictionaryEntryPOTO();

  dictionaryEntryConstructors: Array<ClassConstructor> = [];
  dictionaryEntryMethods: Array<ClassMethod> = [];
  dictionaryEntryProperties: Array<ClassProperty> = [];

  mounted() {
    this.dictionaryEntry = this.objectDictionaryEntry;
    console.log(this.dictionaryEntry);
    const structure: ClassStructure = <ClassStructure>JSON.parse(this.dictionaryEntry.structure);
    this.dictionaryEntryConstructors = structure.entryConstructors;
    this.dictionaryEntryMethods = structure.entryMethods;
    this.dictionaryEntryProperties = structure.entryProperties;
    this.isBootstrapping = false;
  }

  getColorForSaveButton(): string {
    if (this.dictionaryEntryIsInvalid()) return "red";
    return "green"
  }

  hasClassInconsistencies(): boolean {
    return this.dictionaryEntryIsInvalid();
  }

  updateDictionaryEntry() {
    this.isLoading = true;
    this.hasErrors = false;
    const objectDictionaryEntry: ObjectDictionaryEntryPOTO = this.buildObjectDictionaryEntry();
    new ObjectDictionaryAPI().updateObjectDictionaryEntry(
        <string>this.$route.params.projectId,
        <string>this.$route.params.applicationId,
        <string>this.dictionaryEntry?.objectDictionaryId,
        objectDictionaryEntry
    ).then((response: AxiosResponse<ObjectDictionaryEntryPOTO>) => {
      this.$emit("onEdited");
    }).catch((error: AxiosError) => {
      this.hasErrors = true;
      this.errorMessage = ExceptionCommons.parseErrorMessage(error);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  private buildObjectDictionaryEntry(): ObjectDictionaryEntryPOTO {
    let objectDictionaryEntry = this.dictionaryEntry;
    objectDictionaryEntry.structure = JSON.stringify({
      entryConstructors: this.dictionaryEntryConstructors,
      entryMethods: this.dictionaryEntryMethods,
      entryProperties: this.dictionaryEntryProperties,
    });
    objectDictionaryEntry.objectDictionaryId = <string>this.dictionaryEntry.objectDictionaryId;
    return objectDictionaryEntry;
  }

  getSaveButtonTooltip(): string {
    if (this.dictionaryEntry.name.length == 0)
      return "Please add a name to you entry";
    return "Save"
  }

  dictionaryEntryIsInvalid(): boolean {
    if (this.dictionaryEntry.name.length == 0)
      return true;
    return false;
  }

  getConstructorLabel(constructor: ClassConstructor) {
    return ObjectDictionaryEntryCommons.getConstructorLabel(constructor, this.dictionaryEntry.name);
  }

  getMethodLabel(method: ClassMethod) {
    return ObjectDictionaryEntryCommons.getMethodLabel(method);
  }

  getPropertyLabel(property: ClassProperty) {
    return ObjectDictionaryEntryCommons.getPropertyLabel(property);
  }

  addNewConstructor() {
    this.dictionaryEntryConstructors.push(new ClassConstructor());
  }

  addNewMethod() {
    this.dictionaryEntryMethods.push(new ClassMethod());
  }

  addNewProperty() {
    this.dictionaryEntryProperties.push(new ClassProperty());
  }

  addNewArgumentToConstructor(constructor: ClassConstructor) {
    constructor.arguments.push(new PropertyType());
  }

  addNewArgumentToMethod(method: ClassMethod) {
    method.arguments.push(new PropertyType());
  }

  removeConstructorArgument(constructorIndex: number, argumentIndex: number) {
    this.dictionaryEntryConstructors[constructorIndex].arguments.splice(argumentIndex, 1);
  }

  removeMethod(methodIndex: number) {
    this.dictionaryEntryMethods.splice(methodIndex, 1);
  }

  removeProperty(propertyIndex: number) {
    this.dictionaryEntryProperties.splice(propertyIndex, 1);
  }

  removeConstructor(constructorIndex: number) {
    this.dictionaryEntryConstructors.splice(constructorIndex, 1);
  }

  removeMethodArgument(methodIndex: number, argumentIndex: number) {
    this.dictionaryEntryMethods[methodIndex].arguments.splice(argumentIndex, 1);
  }

  closeCreator() {
    this.$emit("close")
  }
}

</script>

<style scoped>

</style>