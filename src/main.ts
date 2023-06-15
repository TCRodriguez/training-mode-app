import { createApp } from "vue";
import { createPinia } from "pinia";
import { defineRule, configure } from "vee-validate";
import { required } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

defineRule('required', required);

configure({
    generateMessage: context => {
        const fieldName = context.field;
        const capitalizeFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        return `${capitalizeFieldName} is required`
    }
});

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
