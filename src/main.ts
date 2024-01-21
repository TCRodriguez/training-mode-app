import { createApp } from "vue";
import { createPinia } from "pinia";
import { defineRule, configure } from "vee-validate";
import { 
    required, 
    email,
    min,
    max,
    regex
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

configure({
    generateMessage: context => {
        const fieldName = context.field;
        // console.log(context);
        const capitalizeFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        return context.rule.name === 'required' ? `${capitalizeFieldName} is required` 
            : context.rule.name === 'min' ? `The ${context.field} must be at least ${context.rule.params[0]} characters`
            : context.rule.name === 'max' ? `The ${context.field} must be no longer than ${context.rule.params[0]} characters`
            : context.rule.name === 'regex' ? `Password must include at least one uppercase letter and one character special character from [!, @, #].`
            : context.rule.name === context.field ? `Must be a valid ${context.field}` 
            :`The ${context.field} is invalid.`;
    }
});



const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);

app.mount("#app");
