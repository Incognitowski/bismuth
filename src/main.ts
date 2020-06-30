import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import AuthenticationAPI from "@/domains/authentication/AuthenticationAPI";
import { AxiosResponse } from "axios";

Vue.config.productionTip = false;

console.log(process.env);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

teste();

async function teste() {
  var authenticationAPI = new AuthenticationAPI();
  var response: AxiosResponse<AuthenticationResponsePOTO> = await authenticationAPI.attemptLogin(
    "teste",
    "123"
  );
  console.log(response);
}
