<template>
    <v-card outlined>
        <v-card-title>
            <h3>Projects</h3>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                            icon
                            rounded
                            v-on="on"
                            v-bind="attrs">
                        <v-icon>fas fa-plus</v-icon>
                    </v-btn>
                </template>
                <span>New Project</span>
            </v-tooltip>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import ProjectAPI from "@/domains/project/ProjectAPI";
    import {AxiosError} from "axios";

    @Component
    export default class Projects extends Vue {

        page = 1;
        size = 5;

        mounted() {
            new ProjectAPI().getAllProjects(this.page, this.size).then(result => {
                console.log(result.data)
            }).catch((error: AxiosError) => {
                console.log(error);
            })
        }

    }
</script>
