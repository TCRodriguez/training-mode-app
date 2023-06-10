<script lang="ts">
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
                router.push('/games');
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
    <div class="flex justify-center h-full ">
        <div class="flex flex-col items-center justify-center space-y-4">
            <div class="flex flex-row">
                <h1 class="text-5xl">TrainingMode</h1>
                <p class="text-xs">TM</p>

            </div>
            <!-- <form action="POST">
                <input type="text" placeholder="email">
                <input type="password" placeholder="password">
            </form> -->
            <Form @submit="onSubmit">
                <div>
                    <Field name="email" type="email" value="user@example.com" placeholder="Email" />
                    <Field name="password" type="password" value="password123" placeholder="Password" />
                </div>
                <div class="flex flex-row justify-center">
                    <button class="rounded p-2 text-white bg-blue w-1/3">Login</button>
                </div>
            </Form>
        </div>
        <!-- <p>Login</p> -->
    </div>
</template>
<style lang="">
    
</style>