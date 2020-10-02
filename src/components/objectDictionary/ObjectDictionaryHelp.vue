<template>
  <v-container fluid>
    <v-row justify="start" align="baseline">
      <h2 class="font-weight-light">Object Dictionary</h2>
      <h3 class="font-weight-light text--secondary ml-2">How does it work?</h3>
    </v-row>
    <v-row class="my-2">
      <v-divider/>
    </v-row>
    <v-card outlined>
      <v-card-text>
        <p class="body-1">
          You can use <b>Object Dictionaries</b> to model important classes in your application.
        </p>
        <p class="body-1">
          A dictionary is composed of entries. Each entry represents a specific class in your application.
          By modelling these classes correctly, you can, for example,
          reference them in HTTP API mappings so developers don't even need to open this screen to analyze the object structure.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class ObjectDictionaryHelp extends Vue {
}
</script>

<style scoped>

</style>