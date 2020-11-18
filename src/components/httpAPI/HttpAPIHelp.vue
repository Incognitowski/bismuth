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
        <p class="body-1">
          The creator allows you to attach many URL arguments to your HTTP endpoint.
          For example: <span class="green--text">https://test.com/api/account/<b>{accountId}</b></span>
          You can create an argument named <b class="green--text">accountId</b> in the argument sessions explaining how to use
          this argument properly. What might it be? An integer or maybe a string?
          Only you know, and you should explain it! 🛠
        </p>

        <p class="body-1">
          Need <span class="green--text">custom headers</span> in your endpoint? No worries, the creator allows you to add as many as you need.
          They can be easily changed from <span class="green--text">default values</span> by the user during the try-it session.
        </p>

        <p class="body-1">
          The creator also allows you to attach <span class="green--text">many request body types</span> as needed to your HTTP endpoint.
          This way users can simulate the same endpoint with multiple body types without the need of
          manually inserting data into the try-it session of your API Documentation.
        </p>

        <p class="body-1">
          The creator also allows you to map <span class="green--text">many response body types along with their response codes</span>.
          Does your endpoint returns different error formats depending on input data? It should not, but if it does,
          Bismuth will work great for you 😉
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