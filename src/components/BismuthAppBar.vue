<template>
    <v-app-bar
            app
            clipped-left
            clipped-right
            dense
            color="accent"
            v-if="this.$store.state.appState.isShowingTopToolbar"
    >
        <img height="30" width="30" class="mr-4" :src="require('../assets/logo.svg')" alt="Bismuth Logo"/>

        <v-toolbar-title>Bismuth</v-toolbar-title>

        <v-menu
                :close-on-content-click="false"
                :nudge-width="200"
                offset-y
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                        class="mx-2"
                        color="transparent"
                        dark
                        depressed
                        small
                        v-bind="attrs"
                        v-on="on">
                    Select a project
                    <v-icon x-small right>fa-chevron-down</v-icon>
                </v-btn>
            </template>

            <v-card class="mt-1">
                <v-card-text>
                    <v-autocomplete
                            dense
                            outlined
                            cache-items
                            class="mx-1"
                            :items="searchedProjects"
                            label="Search projects"
                            :search-input.sync="projectSearchWord"
                    ></v-autocomplete>
                </v-card-text>
            </v-card>
        </v-menu>

        <v-toolbar-title>/</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
            <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class BismuthAppBar extends Vue {
        projectSearchWord: string | null = null;
        
    }
</script>

<style scoped>

</style>