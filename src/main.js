import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueChatScroll from "vue-chat-scroll";

import i18n from "./utils/i18n";
// import VueSpeech from "vue-speech";

// Vue.use(VueSpeech);
Vue.use(VueChatScroll);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount("#app");
