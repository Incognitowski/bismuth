<template>
    <v-container class="fill-height">
        <v-card
                dark
                outlined
                :loading="cardLoader"
                class="mx-auto mt-16 d-flex flex-row"
        >
            <div class="py-16 px-8">
                <img alt="Bismuth Logo" height="200" width="200" class="m-16" :src="require('../../assets/logo.svg')">
            </div>
            <div class="py-16 px-8 d-flex flex-column" style="width: 350px">
                <v-text-field
                        dense
                        outlined
                        label="Username"
                        v-model="username"
                        :disabled="isLoading"
                ></v-text-field>
                <v-text-field
                        dense
                        outlined
                        type="password"
                        label="Password"
                        v-model="password"
                        :disabled="isLoading"
                ></v-text-field>
                <p v-if="hasErrors" class="text-wrap red--text mx-0">{{ errorText }}</p>
                <v-btn color="accent"
                       width="100%"
                       :disabled="isLoading"
                       v-on:click="attemptLogin"
                >
                    LOGIN
                </v-btn>
                <router-link to="/register" class="white--text mt-6 mx-auto">or create an account</router-link>
            </div>
        </v-card>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import AuthenticationAPI from "@/domains/authentication/AuthenticationAPI";
    import {AxiosError} from "axios";
    import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";
    import LocalStorageProvider from "@/providers/LocalStorageProvider";

    @Component
    export default class Login extends Vue {
        username: string = '';
        password: string = '';
        isLoading: boolean = false;
        hasErrors: boolean = false;
        errorText: string = '';

        mounted() {
            this.$store.dispatch("appState/setLeftToolbarVisibility", false);
            this.$store.dispatch("appState/setRightToolbarVisibility", false);
            this.$store.dispatch("appState/setTopToolbarVisibility", false);
            if (new AuthenticationAPI().isLoggedIn()){
              this.validateJWT();
            }
        }

        async attemptLogin() {
            this.isLoading = true;
            this.hasErrors = false;
            new AuthenticationAPI().attemptLogin(this.username, this.password).then(response => {
                const config = LocalStorageProvider.retrieve();
                config.jwt = response.data.token;
                LocalStorageProvider.store(config);
                this.$store.dispatch("appState/setJWT", config.jwt);
                this.$router.push('/dashboard');
            }).catch((error: AxiosError) => {
                const exception: DefaultHTTPException = DefaultHTTPException.fromAxiosError(error);
                this.hasErrors = true;
                this.errorText = exception.message;
            }).finally(() => {
                this.isLoading = false;
            });
        }

        get cardLoader(): string | null {
            if (this.isLoading) return "purple darken-1";
            return null;
        }

      private validateJWT() {
        new AuthenticationAPI().validateJWT().then(() => {
          this.$router.push('/dashboard');
        }).catch(() => {
          console.log("Got to Login page when it really had to.");
        })
      }

    }
</script>