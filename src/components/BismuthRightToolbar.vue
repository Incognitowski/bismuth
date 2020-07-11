<template>
    <v-navigation-drawer
            app
            dark
            right
            clipped
            absolute
            permanent
            mini-variant
            :color="getColor"
            v-if="this.$store.state.appState.isShowingRightToolbar"
    >
        <v-list
                dense
                nav
                class="py-0">
            <v-list-item two-line :class="'px-0'">
                <v-list-item-avatar>
                    <img src="https://randomuser.me/api/portraits/men/81.jpg">
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>Application</v-list-item-title>
                    <v-list-item-subtitle>Subtext</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class BismuthRightToolbar extends Vue {
        get getColor(): string {
            if(this.$vuetify.theme.dark)
                return "grey darken-4";
            return "white"
        }

    }
</script>

<style scoped>

</style>