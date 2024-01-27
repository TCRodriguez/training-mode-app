<script lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { Form, Field, ErrorMessage, configure, useResetForm } from 'vee-validate';
import CloseIcon from './icons/CloseIcon.vue';
import { showToast } from '@/common/helpers';


export default {
    setup(props, context) {
        const authStore = useAuthStore();

        const onSubmit = (values: {email: string}) => {
            const returnURL = window.location.href;
            const { email } = values;
            
            authStore.requestPasswordReset(email, returnURL)
            .then(response => {
                context.emit('triggerCloseMenu');
                showToast('If your email exists in our system you\'ll receive a link to reset your password.', 5000, 'info');
            })
        }
        const handleCancel = () => {
            authStore.closeRequestPasswordResetForm();
            authStore.openLoginForm();
        }

        return {
            authStore,
            handleCancel,
            onSubmit
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
                <div class="flex justify-end">
                    <!-- <CloseIcon class="h-10 w-10 invisible" /> -->
                    <!-- <div v-if="authStore.loginFormMessage.length > 0">
                        <p class="text-green">{{ authStore.loginFormMessage }}</p>
                    </div> -->
                    <CloseIcon class="h-10 w-10" @click="$emit('triggerCloseMenu'), resetForm()" />
                </div>
                <div class="flex flex-row justify-center">
                    <div class="flex flex-row itens-center space-x-1 justify-center">
                        <div class="flex items-center">
                            <p class="">Request password reset for</p>
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
                    <!-- <Field name="password" type="password" placeholder="Password" rules="required" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="password" class="text-red" />
                    <div v-if="loginFailed">
                        <p class="text-red">{{ loginFailedMessage }}</p>
                    </div> -->
                </div>
                <div class="flex flex-row justify-center space-x-4">
                    <div>
                        <button type="Submit" class="rounded border p-2 text-white bg-apex-blue">Send password reset link</button>
                    </div>
                    <div>
                        <button type="button" class="rounded border p-2 text-white bg-apex-blue" @click="handleCancel()">Cancel</button>
                    </div>
                </div>
            </Form>
            <!-- <div class="flex flex-row justify-center">
                <button class="rounded border p-2 text-white bg-apex-blue w-1/3" :class="{ 'hidden': !authStore.credentialsCorrect }" @click="handleResendVerificationLink(emailForResendingVerificationLink)">Resend verification link</button>
            </div> -->
        </div>

    </div>
</template>
<style lang="">


</style>