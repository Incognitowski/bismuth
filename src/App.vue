<template>
    <v-app>
        <v-main>
            <v-container class="fill-height">
                <AppLoader v-if="isGloballyLoading"></AppLoader>
                <router-view v-if="!isGloballyLoading"/>
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import AppLoader from "@/components/AppLoader.vue";
    import LocalStorageProvider from "@/providers/LocalStorageProvider";
    import AuthenticationAPI from "@/domains/authentication/AuthenticationAPI";

    @Component({
        components: {AppLoader}
    })
    export default class App extends Vue {

        private authenticationAPI: AuthenticationAPI;

        constructor() {
            super();
            this.authenticationAPI = new AuthenticationAPI();
        }

        mounted() {
            if (this.authenticationAPI.isLoggedIn()) {
                this.checkIfTokenIsValid();
            } else {
                this.redirectToLoginIfNotAlready();
                this.$store.dispatch('appState/setGlobalLoadingState', false)
            }
        }

        get isGloballyLoading(): boolean {
            return this.$store.state.appState.isGloballyLoading
        }

        private async checkIfTokenIsValid() {
            try {
                await this.authenticationAPI.validateJWT();
                this.redirectToDashboardIfNotAlready();
            } catch (e) {
                this.redirectToLoginIfNotAlready();
            }
            await this.$store.dispatch('appState/setGlobalLoadingState', false)
        }

        private redirectToLoginIfNotAlready() {
            if (this.$route.name != 'Login')
                this.$router.push('/login');
        }

        private redirectToDashboardIfNotAlready() {
            if (this.$route.path == '/')
                this.$router.push('/dashboard');
        }
    }
</script>

