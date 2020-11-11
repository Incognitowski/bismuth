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
    <v-container v-if="!isLoading && objectDictionary != null">
      <v-row no-gutters justify="space-between" align="center">
        <h4 class="font-weight-light">
          <v-icon x-small class="mr-2">
            fas fa-books
          </v-icon>
          <b>{{ objectDictionary.name }}</b>
          <span class="text--secondary text-caption ml-1">Text Documents</span>
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
      <v-row v-if="objectDictionary != null" justify="center" align="start">
        <ObjectDictionaryManager :read-only="false" :object-dictionary-id="objectDictionary.objectDictionaryId"/>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

@Component
export default class TextDocumentDrawer extends Vue {

  isDrawerOpen: boolean = false;
  isLoading : boolean = true;

  textDocument :

  mounted() {

  }

  closeDrawer() {

  }

}

</script>

