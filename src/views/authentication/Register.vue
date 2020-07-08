<template>
    <v-card
            dark
            outlined
            :loading="cardLoader"
            class="mx-auto d-flex flex-row"
    >
        <v-form>
            <div class="py-5 px-8 d-flex flex-column" style="width: 350px">
                <h1 class="mb-5">Register</h1>
                <v-text-field
                        dense
                        outlined
                        type="text"
                        class="mb-2"
                        maxlength="100"
                        label="Username"
                        v-model="username"
                        :disabled="isLoading"
                        :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                        dense
                        outlined
                        type="email"
                        class="mb-2"
                        label="E-Mail"
                        v-model="email"
                        :disabled="isLoading"
                        :rules="[rules.required, rules.email]"
                ></v-text-field>
                <v-text-field
                        dense
                        outlined
                        class="mb-2"
                        type="password"
                        label="Password"
                        v-model="password"
                        :rules="[rules.required]"
                        :disabled="isLoading"
                ></v-text-field>
                <v-text-field
                        dense
                        outlined
                        class="mb-2"
                        type="password"
                        :disabled="isLoading"
                        :rules="[rules.confirmPassword]"
                        label="Password Confirmation"
                        v-model="passwordConfirmation"
                ></v-text-field>
                <p v-if="hasErrors" class="text-wrap red--text mx-0">{{ errorText }}</p>
                <v-btn color='accent' width="100%" :disabled="isLoading" v-on:click="attemptUserCreation">
                    REGISTER
                </v-btn>
                <router-link to="/login" class="white--text mt-6 mx-auto">or login if you're already registered
                </router-link>
            </div>
        </v-form>
        <v-snackbar
                v-model="finishedRegistration"
                bottom
                color="success"
        >
            {{ successMessage }}
        </v-snackbar>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import UserAPI from "@/domains/user/UserAPI";
    import {AxiosError} from "axios";
    import DefaultHTTPException from "@/domains/framework/DefaultHTTPException";

    @Component
    export default class Register extends Vue {
        errorText: string = '';
        hasErrors: boolean = false;
        isLoading: boolean = false;
        finishedRegistration = false;
        successMessage: string = '';

        email: string = '';
        username: string = '';
        password: string = '';
        passwordConfirmation: string = '';

        mounted() {
            this.$store.dispatch("appState/setLeftToolbarVisibility", false);
            this.$store.dispatch("appState/setRightToolbarVisibility", false);
            this.$store.dispatch("appState/setTopToolbarVisibility", false);
        }

        attemptUserCreation() {
            this.isLoading = true;
            this.hasErrors = false;
            new UserAPI().createAccount(this.username, this.email, this.password).then(result => {
                this.finishedRegistration = true;
                this.successMessage = 'Account created, good job! You`ll be redirected';
                setTimeout(() => {
                    this.$router.replace('/login');
                }, 3000);
            }).catch((error: AxiosError) => {
                const exception = DefaultHTTPException.fromAxiosError(error);
                this.hasErrors = true;
                this.errorText = exception.message;
                this.isLoading = false;
            });
        }

        get cardLoader(): string | null {
            if (this.isLoading) return "purple darken-1";
            return null;
        }

        rules: any = {
            required: (value: string) => !!value || 'Required.',
            email: (value: string) => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
            },
            confirmPassword: (value: string) => {
                return (this.passwordConfirmation != this.password) ? 'The passwords do not match.' : true;
            }
        }
    }
</script>
