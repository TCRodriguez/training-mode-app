<script lang=ts>
import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
export default {
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        const onSubmit = (values: {email: string, password: string}) => {
            // alert('submitted');
            console.log(values);
            const { email, password } = values;
            authStore.login(email, password)
            .then(() => {
                // router.push('/games');
                authStore.toggleLoginModal();
            })
            
        }

        return {
            onSubmit
        }
    },
    components: {
        Form,
        Field
    }
}
</script>
<template lang="">
    <div>
        <Form @submit="onSubmit">
        <!-- <Form @submit="$emit('triggerLogin', values)"> -->
                <div class="flex justify-center">
                    <p>Log into TrainingMode</p>
                </div>
                <div>
                    <Field name="email" type="email" value="user@example.com" placeholder="Email" />
                    <Field name="password" type="password" value="password123" placeholder="Password" />
                </div>
                <div class="flex flex-row justify-center">
                    <button class="rounded p-2 text-white bg-blue w-1/3">Login</button>
                </div>
            </Form>
    </div>
</template>
<style lang="">
    
</style>