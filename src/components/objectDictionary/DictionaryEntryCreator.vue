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
      <h3 class="font-weight-light">Create Entry</h3>
    </v-row>
    <v-row class="mt-3 mb-5">
      <v-divider/>
    </v-row>
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
          <v-expansion-panel-header>
            {{ getConstructorLabel(constructor) }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
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
                      @click="addNewArgument(constructor)"
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
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import ObjectDictionaryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryPOTO";
import OnDictionaryEntryCreatedCallbackInterface
  from "@/domains/artifacts/objectDictionary/OnDictionaryEntryCreatedCallbackInterface";
import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";

const DictionaryEntryCreatorProps = Vue.extend({
  props: {
    objectDictionary: Object,
    onCreated: Object,
    stateReference: Boolean,
  }
});

class PropertyType {
  public label: string = '';
  public type: string = '';
  public isArray: boolean = false;
  public isNullable: boolean = false;
}

class ObjectConstructor {
  public description: string = '';
  public arguments: Array<PropertyType> = [];
}

@Component
export default class DictionaryEntryCreator extends DictionaryEntryCreatorProps {

  isBootstrapping: boolean = true;

  currentObjectDictionary: ObjectDictionaryPOTO | null = null;
  onDictionaryCreatedCallback: OnDictionaryEntryCreatedCallbackInterface | null = null;
  dictionaryEntry: ObjectDictionaryEntryPOTO = new ObjectDictionaryEntryPOTO();

  dictionaryEntryConstructors: Array<ObjectConstructor> = [];

  mounted() {
    this.currentObjectDictionary = this.objectDictionary;
    this.onDictionaryCreatedCallback = this.onCreated;
    this.isBootstrapping = false;
  }

  getConstructorLabel(constructor: ObjectConstructor) {
    let label: string = this.dictionaryEntry.name + "(";
    constructor.arguments.map((value, index) => {
      label += value.label + " : ";
      if (value.isNullable) {
        label += " Nullable ";
      }
      if (value.isArray) {
        label += "Array<" + value.type + ">"
      } else {
        label += value.type
      }
      if (index != constructor.arguments.length - 1) {
        label += ", ";
      }
    })
    label += ")";
    return label;
  }

  addNewConstructor() {
    this.dictionaryEntryConstructors.push(new ObjectConstructor());
  }

  addNewArgument(constructor: ObjectConstructor) {
    constructor.arguments.push(new PropertyType());
  }

  removeConstructorArgument(constructorIndex: number, argumentIndex: number) {
    this.dictionaryEntryConstructors[constructorIndex].arguments.splice(argumentIndex, 1);
  }

  closeCreator() {
    this.stateReference = false;
  }

}

</script>

<style scoped>

</style>