<template>
  <v-container fluid>
    <v-row justify="start" align="baseline">
      <h2 class="font-weight-light">HTTP API</h2>
      <h3 class="font-weight-light text--secondary ml-2">How does it work?</h3>
    </v-row>
    <v-row class="my-2">
      <v-divider/>
    </v-row>
    <v-card outlined>
      <v-card-text>
        <p class="body-1">
          You can use <b>HTTP APIs</b> map any web based API in your software.
        </p>
        <p class="body-1">
          An API is composed onf many requests. Each request must have its own responsibility,
          and generally should do only one thing.
          You can consume them via any language capable of HTTP Calls.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class HttpAPIHelp extends Vue {
}
</script>

<style scoped>

</style>