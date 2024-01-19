<script lang=ts>
import { useAuthStore } from '@/stores/AuthStore';
import { Form, Field, ErrorMessage, configure } from 'vee-validate';
import CloseIcon from './icons/CloseIcon.vue';
import { ref, computed } from 'vue';

export default {
    setup() {
        const authStore = useAuthStore();
        const loginFailedMessage = computed(() => authStore.loginFailedMessage);
        const loginFailed = ref(false);
        const emailForResendingVerificationLink = ref('');
        const onSubmit = (values: {email: string, password: string}) => {
            const { email, password } = values;
            emailForResendingVerificationLink.value = email;
            
            authStore.login(email, password)
            .then(response => {
                let responseMessage;
                if(response.response) {
                    responseMessage = response.response.data.message;
                }
                if(responseMessage === 'The provided credentials are incorrect.') {
                    authStore.updateLoginFailedMessage('Incorrect email or password');
                    loginFailed.value = true;
                    return;
                } else if (responseMessage === 'Email not yet verified.') {
                    authStore.updateLoginFailedMessage(`Email not yet verified. Please check your inbox for a verification link.`);
                    authStore.updateCredentialsCorrect(true);
                    loginFailed.value = true;
                    return;
                }
            })
        }

        const handleResendVerificationLink = (email: string) => {
            authStore.resendVerificationLink(email)
            .then(response => {
                console.log(response);
                if(response.status === 200) {
                    authStore.updateLoginFormMessage('Verification link sent. Please check your inbox.');
                    return;
                } else if(response.response.data.message === "Too Many Attempts.") {
                    authStore.updateLoginFailedMessage('Too many attempts. Please try again later.');
                    return;
                }
            })
        }


        return {
            authStore,
            onSubmit,
            loginFailed,
            loginFailedMessage,
            handleResendVerificationLink,
            emailForResendingVerificationLink
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
                    <div v-if="authStore.loginFormMessage.length > 0">
                        <p class="text-green">{{ authStore.loginFormMessage }}</p>
                    </div>
                    <CloseIcon class="h-10 w-10" @click="$emit('triggerToggleLoginModal'), resetForm()" />
                </div>
                <div class="flex flex-row justify-center">
                    <div class="flex flex-row itens-center space-x-1 justify-center">
                        <div class="flex items-center">
                            <p class="">Log into</p>
                        </div>
                        <img class="w-1/2 h-auto" src="/src/assets/Training_Mode_Logo_White.png" alt="">
                        <div>
                            <p class="text-xs font-bold">TM</p>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <Field name="email" type="email" placeholder="Email" rules="required|email" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="email" class="text-red"/>
                    <Field name="password" type="password" placeholder="Password" rules="required" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="password" class="text-red" />
                    <div v-if="loginFailed">
                        <p class="text-red">{{ loginFailedMessage }}</p>
                    </div>
                </div>
                <div class="flex flex-row justify-center">
                    <button class="rounded border p-2 text-white bg-apex-blue w-1/3">Login</button>
                </div>
            </Form>
            <div class="flex flex-row justify-center">
                <button class="rounded border p-2 text-white bg-apex-blue w-1/3" :class="{ 'hidden': !authStore.credentialsCorrect }" @click="handleResendVerificationLink(emailForResendingVerificationLink)">Resend verification link</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
    input::placeholder {
        @apply text-white;
    }
</style>