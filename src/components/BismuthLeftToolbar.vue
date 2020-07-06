<template>
    <v-navigation-drawer
            app
            dark
            clipped
            absolute
            mini-variant
            expand-on-hover
            color="transparent"
            v-if="this.$store.state.appState.isShowingLeftToolbar"
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

            <v-divider></v-divider>

            <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class BismuthLeftToolbar extends Vue {
        items: any = [
            {title: 'Dashboard', icon: 'mdi-view-dashboard'},
            {title: 'Photos', icon: 'mdi-image'},
            {title: 'About', icon: 'mdi-help-box'},
        ]
    }
</script>

<style scoped>

</style>