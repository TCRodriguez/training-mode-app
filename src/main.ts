import { createApp } from "vue";
import { createPinia } from "pinia";
import { defineRule, configure } from "vee-validate";
import { required, email } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

defineRule('required', required);
defineRule('email', email);

configure({
    generateMessage: context => {
        const fieldName = context.field;
        // console.log(context);
        const capitalizeFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        return context.rule.name === 'required' ? `${capitalizeFieldName} is required` 
            : context.rule.name === context.field ? `Must be a valid ${context.field}` 
            : null;
    }
});

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
