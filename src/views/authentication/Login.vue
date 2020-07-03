<template>
    <v-card
            dark
            class="mx-auto"
            max-width="344"
            outlined
    >
        <img :src="require('../../assets/logo.svg')">

        <v-card-actions>
            <v-btn text>Button</v-btn>
            <v-btn text>Button</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Login extends Vue {

    }
</script>