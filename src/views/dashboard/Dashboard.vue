<template>

</template>

<script>
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Dashboard extends Vue {

        mounted() {
            this.$store.dispatch("appState/setLeftToolbarVisibility", true);
            this.$store.dispatch("appState/setRightToolbarVisibility", true);
            this.$store.dispatch("appState/setTopToolbarVisibility", true);
        }

    }
</script>