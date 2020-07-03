<template>
    <v-container>
        <p class="text-center text-caption">{{ selectedStatement }}</p>
        <v-col cols="6" sm="8" md="4" class="my-auto mx-auto">
            <v-progress-linear
                    rounded
                    indeterminate
            />
        </v-col>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class AppLoader extends Vue {

        mounted() {
            this.intervalHandlerId = setInterval(() => {
                console.log("changed statement");
                this.selectedStatement = this.loadingStatements[Math.floor(Math.random() * this.loadingStatements.length)]
            }, 5000);

        }

        public loadingStatements: Array<String> = [
            '“First, solve the problem. Then, write the code.” – John Johnson',
            '“Code is like humor. When you have to explain it, it’s bad.” – Cory House',
            '“Simplicity is the soul of efficiency.” – Austin Freeman',
            '“Before software can be reusable it first has to be usable.” – Ralph Johnson',
            '“Any fool can write code that a computer can understand. Good programmers write code that humans can understand.” – Martin Fowler',
            '"It’s not a bug – it’s an undocumented feature." - Unknown',
            '"One man’s crappy software is another man’s full-time job." - Jessica Gaston',
            '"Without requirements or design, programming is the art of adding bugs to an empty text file." - Louis Srygley',
        ];

        public selectedStatement: String = this.loadingStatements[Math.floor(Math.random() * this.loadingStatements.length)];

        public intervalHandlerId: number | undefined;

        destroyed() {
            clearInterval(this.intervalHandlerId);
        }

    }
</script>
