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
      <v-list-item two-line class="px-0">
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/men/81.jpg" alt="Avatar">
        </v-list-item-avatar>
      </v-list-item>
      <v-spacer/>
      <v-list-item two-line class="px-0">
        <v-list-item-action>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="logout"
              >
                <v-icon>fas fa-power-off</v-icon>
              </v-btn>
            </template>
            <span>Log out</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class BismuthRightToolbar extends Vue {
  get getColor(): string {
    if (this.$vuetify.theme.dark)
      return "grey darken-4";
    return "white"
  }

  private logout() {
    console.log("Yeet");
  }

}
</script>

<style scoped>

</style>