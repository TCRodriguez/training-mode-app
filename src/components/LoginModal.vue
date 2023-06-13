<script lang=ts>
import { useAuthStore } from '@/stores/AuthStore';
import { Form, Field } from 'vee-validate';
import CloseIcon from './icons/CloseIcon.vue';
export default {
    setup() {
        const authStore = useAuthStore();
        const onSubmit = (values: {email: string, password: string}) => {
            console.log(values);
            const { email, password } = values;
            authStore.login(email, password)
            .then(() => {
                authStore.toggleLoginModal();
            })
            
        }

        return {
            onSubmit
        }
    },
    components: {
        Form,
        Field,
        CloseIcon
    }
}
</script>
<template lang="">
    <div>
        <div>
            <div class="flex justify-end">
                <CloseIcon class="h-10 w-10" @click="$emit('triggerToggleLoginModal')" />
            </div>
            <Form @submit="onSubmit">
                <div class="flex flex-row justify-center">
                    <div class="flex flex-row itens-center space-x-1">
                        <div class="flex items-center">
                            <p class="">Log into</p>

                        </div>
                        <p class="font-bold text-lg">TrainingMode</p>
                    </div>
                    <div>
                        <p class="text-xs">TM</p>
                    </div>
                </div>
                <div>
                    <Field name="email" type="email" placeholder="Email" />
                    <Field name="password" type="password" placeholder="Password" />
                </div>
                <div class="flex flex-row justify-center">
                    <button class="rounded p-2 text-white bg-blue w-1/3">Login</button>
                </div>
            </Form>
        </div>
    </div>
</template>
<style lang="">
    
</style>