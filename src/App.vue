<template>
    <v-app>
        <BismuthLeftToolbar/>
        <BismuthRightToolbar/>
        <BismuthAppBar/>
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
    import BismuthAppBar from "@/components/BismuthAppBar.vue";
    import BismuthLeftToolbar from "@/components/BismuthLeftToolbar.vue";
    import BismuthRightToolbar from "@/components/BismuthRightToolbar.vue";
    import AuthenticationAPI from "@/domains/authentication/AuthenticationAPI";

    @Component({
        components: {
            BismuthLeftToolbar,
            BismuthRightToolbar,
            AppLoader,
            BismuthAppBar
        }
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

