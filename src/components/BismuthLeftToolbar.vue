<template>
    <v-navigation-drawer
            app
            dark
            :color="getColor"
            clipped
            absolute
            permanent
            mini-variant
            expand-on-hover
            v-if="this.$store.state.appState.isShowingLeftToolbar"
    >
        <v-list
                dense
                nav
                class="py-0 mt-2">
            <v-list-item link v-on:click="goToDashboard">
                <v-list-item-icon>
                    <v-icon>fas fa-pager</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link v-on:click="goToProjects">
                <v-list-item-icon>
                    <v-icon dense>fas fa-tools</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Projects</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class BismuthLeftToolbar extends Vue {

        public goToDashboard() {
            if (this.$route.path == "/dashboard") return;
            this.$router.replace('/dashboard')
        }

        public goToProjects() {
            if (this.$route.path == "/dashboard/projects") return;
            this.$router.replace('/dashboard/projects')
        }

        get getColor(): string {
            if(this.$vuetify.theme.dark)
                return "grey darken-4";
            return "white"
        }

    }
</script>

<style scoped>

</style>