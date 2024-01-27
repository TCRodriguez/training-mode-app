import { createApp } from "vue";
import { createPinia } from "pinia";
import { defineRule, configure } from "vee-validate";
import { 
    required, 
    email,
    min,
    max,
    regex,
    confirmed,
} from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
defineRule('regex', regex);
defineRule('confirmed', confirmed);

configure({
    generateMessage: context => {
        const fieldName = context.field;
        const capitalizeFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if(context.rule.name === 'required') {
            if(context.field === 'betaTerms') {
                return `Acknowledgement is required`
            } else {
                return `${capitalizeFieldName} is required`;
            }
        } else if (context.rule.name === 'min') {
            return `The ${context.field} must be at least ${context.rule.params[0]} characters`;
        } else if(context.rule.name === 'max') {
            return `The ${context.field} must be no longer than ${context.rule.params[0]} characters`;
        } else if(context.rule.name === 'regex') {
            if(context.name === 'username') {
                return `Username cannot include a # character`;
            } else {
                return `Password must include at least one uppercase letter and one character special character from [!, @, #].`;
            }
        } else if(context.rule.name === 'email') {
            return `Must be a valid email address.`;
        }
    }
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);

app.mount("#app");
