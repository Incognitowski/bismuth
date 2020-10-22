<template>
  <v-card class="mt-3" style="width: 100%" outlined>
    <v-card-title>
      {{ entry.name }}
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
        <span>Delete Entry</span>
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
        <span>Edit Entry</span>
      </v-tooltip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row dense>
        <v-col cols="3">
          <v-list shaped color="#00000000" dense>
            <v-list-item-group v-model="selectedMenuItemIndex" color="primary">
              <v-list-item
                  v-for="menuItem in menuItems"
                  :key="menuItem.item"
              >
                <v-list-item-icon style="margin-right: 10px">
                  <v-icon small v-text="menuItem.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content :title="menuItem.label">
                  <v-list-item-title :title="menuItem.label" v-text="menuItem.label"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="9">
          <v-container v-if="menuStateIsDescription">
            <v-row justify="start">
              <h2 class="text--secondary font-weight-light mb-2">Class Description</h2>
            </v-row>
            <v-row justify="start">
              <p class="text-body-1 font-weight-thin">{{ getDescription() }}</p>
            </v-row>
          </v-container>
          <v-container v-if="menuStateIsJSON">
            <v-row justify="start">
              <h2 class="text--secondary font-weight-light mb-2">JSON Structure</h2>
            </v-row>
            <v-row justify="start">
              <pre class="text-body-1 font-weight-thin nice-pre">{{ getJSONStructure() }}</pre>
            </v-row>
          </v-container>
          <v-container v-if="menuStateIsConstructors">
            <v-row justify="start">
              <h2 class="text--secondary font-weight-light mb-2">Constructors
                ({{ entryClassStructure.entryConstructors.length }})</h2>
            </v-row>
            <v-row align="center" v-for="(classConstructor, i) in entryClassStructure.entryConstructors"
                   justify="start">
              <v-col cols="1">
                <v-row justify="start">
                  <h1>#{{ i }}</h1>
                </v-row>
              </v-col>
              <v-col justify="start" cols="11">
                <h3 class="mb-2">{{ getClassConstructorLabel(classConstructor) }}</h3>
                <span class="text-caption">{{ classConstructor.description }}</span>
                <v-divider class="my-2"/>
              </v-col>
            </v-row>
          </v-container>
          <v-container v-if="menuStateIsProperties">
            <v-row justify="start">
              <h2 class="text--secondary font-weight-light mb-2">Properties ({{
                  entryClassStructure.entryProperties.length
                }})</h2>
            </v-row>
            <v-col justify="start" v-for="classProp in entryClassStructure.entryProperties">
              <h3 class="mb-2">{{ getClassPropLabel(classProp) }}</h3>
              <span class="text-caption">{{ classProp.description }}</span>
              <v-divider class="my-2"/>
            </v-col>
          </v-container>
          <v-container v-if="menuStateIsMethods">
            <v-row justify="start">
              <h2 class="text--secondary font-weight-light mb-2">Methods ({{
                  entryClassStructure.entryMethods.length
                }})</h2>
            </v-row>
            <v-col justify="start" v-for="classMethod in entryClassStructure.entryMethods">
              <h3 class="mb-2">{{ getClassMethodLabel(classMethod) }}</h3>
              <span class="text-caption">{{ classMethod.description }}</span>
              <v-divider class="my-2"/>
            </v-col>
          </v-container>
        </v-col>
      </v-row>
    </v-card-text>
    <v-dialog
        v-model="isDeleting"
        width="500"
        overlay-color="black"
    >
      <v-card :loading="isSendingDeleteRequest">
        <v-card-title class="headline">
          Delete Object Dictionary Entry
        </v-card-title>
        <v-card-text>
          Would you like to delete the <b>{{ entry.name }}</b> dictionary entry? This action is irreversible and will
          show up on the events tab of this object dictionary.
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
import ObjectDictionaryEntryPOTO from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryPOTO";
import {Watch} from "vue-property-decorator";
import ClassConstructor from "@/domains/artifacts/objectDictionary/ClassConstructor";
import ClassMethod from "@/domains/artifacts/objectDictionary/ClassMethod";
import ClassProperty from "@/domains/artifacts/objectDictionary/ClassProperty";
import ObjectDictionaryEntryCommons from "@/domains/artifacts/objectDictionary/ObjectDictionaryEntryCommons";
import ClassStructure from "@/domains/artifacts/objectDictionary/ClassStructure";
import ObjectDictionaryAPI from "@/domains/artifacts/objectDictionary/ObjectDictionaryAPI";
import {AxiosError, AxiosResponse} from "axios";

const DictionaryEntryListItemProps = Vue.extend({
  props: {
    objectDictionaryEntry: Object,
    readOnly: Boolean,
    callEditor: Object,
    isLoading: Boolean,
  }
});

enum MenuItemEnum {
  DESCRIPTION,
  JSON,
  PROPERTIES,
  METHODS,
  CONSTRUCTORS,
}

class MenuItem {
  label: string = "";
  icon: string = "";
  item: MenuItemEnum = MenuItemEnum.DESCRIPTION;
}

@Component
export default class DictionaryEntryListItem extends DictionaryEntryListItemProps {

  get menuItems(): Array<MenuItem> {
    if (!this.entryClassStructure) {
      return [
        {
          label: "Description",
          icon: "fas fa-info",
          item: MenuItemEnum.DESCRIPTION
        },
        {
          label: "JSON",
          icon: "fas fa-file-code",
          item: MenuItemEnum.JSON
        },
        {
          label: "Constructors",
          icon: "fas fa-drafting-compass",
          item: MenuItemEnum.CONSTRUCTORS
        },
        {
          label: "Properties",
          icon: "fas fa-stream",
          item: MenuItemEnum.PROPERTIES
        },
        {
          label: "Methods",
          icon: "fas fa-terminal",
          item: MenuItemEnum.METHODS
        },
      ];
    } else {
      return [
        {
          label: "Description",
          icon: "fas fa-info",
          item: MenuItemEnum.DESCRIPTION
        },
        {
          label: "JSON",
          icon: "fas fa-file-code",
          item: MenuItemEnum.JSON
        },
        {
          label: `Constructors (${this.entryClassStructure.entryConstructors.length})`,
          icon: "fas fa-drafting-compass",
          item: MenuItemEnum.CONSTRUCTORS
        },
        {
          label: `Properties (${this.entryClassStructure.entryProperties.length})`,
          icon: "fas fa-stream",
          item: MenuItemEnum.PROPERTIES
        },
        {
          label: `Methods (${this.entryClassStructure.entryMethods.length})`,
          icon: "fas fa-terminal",
          item: MenuItemEnum.METHODS
        },
      ]
    }
  }

  isDeleting: boolean = false;
  isSendingDeleteRequest: boolean = false;

  selectedMenuItemIndex: number = 0;
  selectedMenuItem: MenuItem = this.menuItems[0];

  entryClassStructure: ClassStructure = new ClassStructure();

  mounted() {
    this.entryClassStructure = <ClassStructure>JSON.parse(this.entry.structure);
  }

  getJSONStructure(): string {
    let customObject: any = {};
    this.entryClassStructure.entryProperties.map(((value: ClassProperty, index: number) => {
      customObject[value.name] = value.type;
    }));
    return JSON.stringify(customObject, null, 2);
  }

  getDescription() {
    if (!this.entry.description || this.entry.description.length == 0)
      return "No description was provided to this class. What a shame, don't you think? 😔";
    return this.entry.description;
  }

  getClassConstructorLabel(classConstructor: ClassConstructor): string {
    return ObjectDictionaryEntryCommons.getConstructorLabel(classConstructor, this.entry.name);
  }

  getClassMethodLabel(classMethod: ClassMethod): string {
    return ObjectDictionaryEntryCommons.getMethodLabel(classMethod);
  }

  getClassPropLabel(classProp: ClassProperty): string {
    return ObjectDictionaryEntryCommons.getPropertyLabel(classProp);
  }

  private deleteEntry() {
    this.isSendingDeleteRequest = true;
    new ObjectDictionaryAPI().deleteEntry(
        <string>this.$route.params.projectId,
        <string>this.$route.params.applicationId,
        <string>this.entry?.objectDictionaryId,
        this.entry.objectDictionaryEntryId
    ).then((response: AxiosResponse) => {
      this.isDeleting = false;
      this.$emit("onDeleted");
    }).catch((error: AxiosError) => {
    }).finally(() => {
      this.isSendingDeleteRequest = false;
    })
  }

  private invokeDeletion() {
    this.isDeleting = true;
  }

  private invokeEditor() {
    this.$emit("callEditor", this.objectDictionaryEntry);
  }

  get isParentLoading(): boolean {
    return this.isLoading;
  }

  get entry(): ObjectDictionaryEntryPOTO {
    return this.objectDictionaryEntry;
  }

  get menuStateIsDescription(): boolean {
    return this.selectedMenuItem.item == MenuItemEnum.DESCRIPTION;
  }

  get menuStateIsJSON(): boolean {
    return this.selectedMenuItem.item == MenuItemEnum.JSON;
  }

  get menuStateIsConstructors(): boolean {
    return this.selectedMenuItem.item == MenuItemEnum.CONSTRUCTORS;
  }

  get menuStateIsProperties(): boolean {
    return this.selectedMenuItem.item == MenuItemEnum.PROPERTIES;
  }

  get menuStateIsMethods(): boolean {
    return this.selectedMenuItem.item == MenuItemEnum.METHODS;
  }

  get isReadOnly() : boolean {
    return this.readOnly;
  }

  @Watch("selectedMenuItemIndex")
  onSelectedMenuItemIndexChanged(newValue: number = 0, oldValue: number = 0) {
    this.selectedMenuItem = this.menuItems[newValue];
  }

}

</script>

<style scoped>

.nice-pre {
  width: 100%;
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}

</style>