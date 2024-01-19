<script lang=ts>
import { useAuthStore } from '@/stores/AuthStore';
import { Form, Field, ErrorMessage, configure, useResetForm } from 'vee-validate';
import CloseIcon from './icons/CloseIcon.vue';
import { ref } from 'vue';

export default {
    setup(props, context) {
        const resetForm = useResetForm();
        const authStore = useAuthStore();
        const registrationFailed = ref(false);
        const registrationFailedMessage = ref('');
        const onSubmit = (values: {username: string, email: string, password: string}) => {
            const returnURL = window.location.href;
            console.log(returnURL);
            const { username, email, password } = values;
            authStore.registerUser(username, email, password, returnURL)
            .then(response => {
                console.log(response);
                let responseMessage;
                if(response.status === 200) {
                    resetForm();
                    context.emit('triggerCloseRegistrationForm', true);
                    context.emit('triggerOpenLoginForm');
                    console.log('do I get here?');
                    responseMessage = response.response.data.message;
                    return;
                } else if(response.response.data.message.includes('Username is already taken')) {
                    console.log('test');
                    registrationFailedMessage.value = 'Username is already taken';
                    registrationFailed.value = true;
                    setTimeout(() => {
                        registrationFailed.value = false;
                    }, 3000);
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            })
        }


        return {
            onSubmit,
            registrationFailed,
            registrationFailedMessage
        }
    },
    components: {
        Form,
        Field,
        ErrorMessage,
        CloseIcon
    }
}
</script>
<template lang="">
    <div>
        <div>
            <Form @submit="onSubmit" v-slot="{ resetForm }">
                <div class="flex justify-between">
                    <CloseIcon class="h-10 w-10 invisible" />
                    <!-- TODO: Remove this after implementing toast library -->
                    <div v-if="registrationFailed">
                        <p class="text-red">{{ registrationFailedMessage }}</p>
                    </div>
                    <CloseIcon class="h-10 w-10" @click="$emit('triggerCloseMenu', false), resetForm()" />
                </div>
                <div class="flex flex-row justify-center">
                    <div class="flex flex-row itens-center space-x-1 justify-center">
                        <div class="flex items-center">
                            <p class="">Sign up for </p>
                        </div>
                        <img class="w-1/2 h-auto" src="/src/assets/Training_Mode_Logo_White.png" alt="">
                        <div>
                            <p class="text-xs font-bold">TM</p>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <Field name="username" type="text" placeholder="Username" rules="required|min:3|max:15" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="username" class="text-red"/>
                    <Field name="email" type="email" placeholder="Email" rules="required|email" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="email" class="text-red"/>
                    <Field name="password" type="password" placeholder="Password" :rules="{ required: true, min: 8, max: 32, regex: /^(?=.*[A-Z])(?=.*[!@#]).+$/ }" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" value="Password123!" />
                    <ErrorMessage name="password" class="text-red" />
                </div>
                <div class="flex flex-row justify-center">
                    <button class="rounded border p-2 text-white bg-apex-blue w-1/3">Create account</button>
                </div>
            </Form>
        </div>
    </div>
</template>
<style scoped>
    input::placeholder {
        @apply text-white;
    }
</style>