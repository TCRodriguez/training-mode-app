<script lang=ts>
import { useAuthStore } from '@/stores/AuthStore';
import { useNavigationStore } from '@/stores/NavigationStore';
import { Form, Field, ErrorMessage, configure } from 'vee-validate';
import CloseIcon from './icons/CloseIcon.vue';
import DiscordLogoWithTextIcon from './icons/DiscordLogoWithTextIcon.vue';
import { ref, computed } from 'vue';

export default {
    setup() {
        const authStore = useAuthStore();
        const navigationStore = useNavigationStore();
        const loginFailedMessage = computed(() => authStore.loginFailedMessage);
        const loginFailed = ref(false);
        const emailForResendingVerificationLink = ref('');
        const showPassword = ref(false);
        const onSubmit = (values: {username: string, password: string}) => {
            const { username, password } = values;
            // emailForResendingVerificationLink.value = email;
            
            authStore.login(username, password)
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
                } else if(responseMessage.includes('Too Many Attempts.')) {
                    authStore.updateLoginFailedMessage('Too many attempts. Please try again later.');
                    loginFailed.value = true;
                    
                    return;
                }
            })
        }

        const handleResendVerificationLink = (email: string) => {
            return;
            authStore.resendVerificationLink(email)
            .then(response => {
                if(response.status === 200) {
                    authStore.updateLoginFormMessage('Verification link sent. Please check your inbox for an email from "TrainingMode". If you don\'t see it, check your spam folder.');
                    return;
                } else if(response.response.data.message === "Too Many Attempts.") {
                    authStore.updateLoginFailedMessage('Too many attempts. Please try again later.');
                    return;
                }
            })
        }

        const handleForgotPasswordLink = () => {
            // authStore.updateForgotPasswordModalOpen(true);
            // authStore.submitPasswordResetRequest();
            authStore.closeLoginForm();
            authStore.openRequestPasswordResetForm();
        }

        const handleShowPassword = () => {
            if(showPassword.value === false) {
                showPassword.value = true;
                setTimeout(() => {
                    showPassword.value = false;
                }, 3000);
                return;
            } else {
                showPassword.value = false;
                return;
            }
        }

        const handleCancel = () => {
            authStore.closeLoginForm();
            navigationStore.openMenuModalItems();
        }

        const handleDiscordLogin = () => {
            authStore.oAuthLogin('discord');
        }


        return {
            authStore,
            onSubmit,
            loginFailed,
            loginFailedMessage,
            handleResendVerificationLink,
            emailForResendingVerificationLink,
            handleForgotPasswordLink,
            showPassword,
            handleShowPassword,
            handleCancel,
            handleDiscordLogin
        }
    },
    components: {
        Form,
        Field,
        ErrorMessage,
        CloseIcon,
        DiscordLogoWithTextIcon
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
                    <Field name="username" type="text" placeholder="Username" rules="required" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="username" class="text-red"/>
                    <div class="flex flex-row items-center space-x-4">
                        <Field name="password" :type="showPassword ? 'text' : 'password'" placeholder="Password" rules="required" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                        <span @click="handleShowPassword()">{{showPassword ? 'Hide' : 'Show'}}</span>
                    </div>
                    <ErrorMessage name="password" class="text-red" />
                    <div v-if="loginFailed">
                        <p class="text-red">{{ loginFailedMessage }}</p>
                    </div>
                </div>
                <div class="flex flex-col items-center space-y-4">
                    <div class="space-x-2">
                        <button type="Submit" class="rounded border p-2 text-white bg-apex-blue">Login</button>
                        <button type="button" class="rounded border p-2 text-white bg-apex-blue" @click="handleCancel()">Cancel</button>
                    </div>
                    <div>
                        <button type="button" class="text-white bg-apex-blue opacity-75" @click="handleForgotPasswordLink">Forgot password?</button>
                    </div>
                </div>
            </Form>
            <!-- <div class="flex flex-row justify-center">
                <button class="rounded border p-2 text-white bg-apex-blue w-1/3" :class="{ 'hidden': !authStore.credentialsCorrect }" @click="handleResendVerificationLink(emailForResendingVerificationLink)">Resend verification link</button>
            </div> -->
        </div>
        <div class="mt-8">
            <div class="flex justify-center my-8">
                <p> - OR - </p>
            </div>
            <div class="flex flex-row items-center space-x-2 justify-center border rounded p-2" @click="handleDiscordLogin()">
                <p>Login with</p>
                <DiscordLogoWithTextIcon class="xs:w-1/3 lg:w-1/5" />
            </div>
        </div>
    </div>
</template>
<style scoped>
    input::placeholder {
        @apply text-white;
    }
</style>