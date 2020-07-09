import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

export default new Vuetify({
    theme : {
        dark: true,
        themes: {
            dark : {
                primary: '#744FC6',
                accent: '#49AD6A'
            }
        }
    },
    icons: {
        iconfont: 'fa',
    },
});
