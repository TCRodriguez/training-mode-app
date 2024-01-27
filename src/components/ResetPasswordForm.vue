<script lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { Form, Field, ErrorMessage, configure, useResetForm } from 'vee-validate';
import CloseIcon from './icons/CloseIcon.vue';
import { ref } from 'vue';
import { showToast } from '@/common/helpers';
import { useRoute, useRouter } from 'vue-router';
import { getQueryParam } from '@/common/helpers';
import { toast, type ToastOptions } from 'vue3-toastify';

export default {
    setup(props, context) {
        const authStore = useAuthStore();
        const router = useRouter();
        const route = useRoute();

        const showPassword = ref(false);

        const onSubmit = (values: {newPassword: string}) => {
            const token = getQueryParam('password-reset-token');
            const email = getQueryParam('email');
            const { newPassword } = values;
            
            authStore.resetPassword(email, newPassword, token)
            .then(response => {
                context.emit('triggerCloseMenu');
                if(response.data.message.includes("Password has been successfully reset.")) {
                    toast.success("Password successfully reset! You may now log in.", {
                        autoClose: 5000,
                        position: toast.POSITION.TOP_CENTER,
                        onClose: () => {
                            return router.replace({ query: {} });
                        }
                    } as ToastOptions);
                }
            })
            .catch(error => {
                router.replace({ query: {} });
                showToast('There was a problem resetting your password.', 5000, 'error');
                toast.error("There was a problem resetting your password.", {
                    autoClose: 5000,
                    position: toast.POSITION.TOP_CENTER,
                    onClose: () => {
                        return router.replace({ query: {} });
                    }
                } as ToastOptions);
            });
        }
        const handleCancel = () => {
            if (confirm("Are you sure you want to cancel your password reset?")) {
                context.emit('triggerCloseMenu');
                router.replace({ query: {} });

            }
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


        return {
            authStore,
            handleCancel,
            onSubmit,
            showPassword,
            handleShowPassword
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
                <div class="flex flex-row justify-center">
                    <div class="flex flex-row itens-center space-x-1 justify-center">
                        <div class="flex items-center">
                            <p class="">Reset password for</p>
                        </div>
                        <img class="w-1/2 h-auto" src="/src/assets/Training_Mode_Logo_White.png" alt="">
                        <div>
                            <p class="text-xs font-bold">TM</p>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <div class="flex flex-row items-center space-y-4">
                        <Field name="newPassword" type="password" placeholder="New password" :rules="{ required: true, min: 8, max: 32, regex: /^(?=.*[A-Z])(?=.*[!@#]).+$/ }" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                        <span @click="handleShowPassword()">{{showPassword ? 'Hide' : 'Show'}}</span>
                    </div>
                    <ErrorMessage name="newPassword" class="text-red" />
                    <Field name="new-password-confirmation" type="password" placeholder="Re-type new password" rules="confirmed:@newPassword" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="new-password-confirmation" class="text-red" />
                </div>
                <div class="flex flex-row justify-center space-x-4">
                    <div>
                        <button type="Submit" class="rounded border p-2 text-white bg-apex-blue">Reset password</button>
                    </div>
                    <div>
                        <button type="button" class="rounded border p-2 text-white bg-apex-blue" @click="handleCancel()">Cancel</button>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>
<style lang="">


</style>