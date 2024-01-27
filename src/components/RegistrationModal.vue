<script lang=ts>
import { useAuthStore } from '@/stores/AuthStore';
import { useNavigationStore } from '@/stores/NavigationStore';
import { Form, Field, ErrorMessage, useResetForm } from 'vee-validate';
import CloseIcon from './icons/CloseIcon.vue';
import { ref, computed } from 'vue';
import { showToast } from '@/common/helpers';

export default {
    setup(props, context) {
        const resetForm = useResetForm();
        const authStore = useAuthStore();
        const betaTermsActive = computed(() => authStore.betaTermsAndConditionsActive);
        const navigationStore = useNavigationStore();
        const registrationFailed = ref(false);
        const registrationFailedMessage = ref('');
        const onSubmit = (values: {username: string, email: string, password: string}) => {
            context.emit('triggerCloseMenu');
            resetForm();
            showToast('Submitting registration...', 3000, 'info');
            const returnURL = window.location.href;
            const { username, email, password } = values;
            authStore.registerUser(username, email, password, returnURL)
            .then(response => {
                let responseMessage;
                if(response.status === 200) {
                    responseMessage = response.response.data.message;
                    return;
                } else if(response.response.data.message.includes('Username is already taken')) {
                    registrationFailedMessage.value = 'Username is already taken';
                    registrationFailed.value = true;
                    setTimeout(() => {
                        registrationFailed.value = false;
                    }, 3000);
                    return;
                } else if(response.response.data.message.includes('Email is already taken')) {
                    registrationFailedMessage.value = 'Email is already taken';
                    registrationFailed.value = true;
                    setTimeout(() => {
                        registrationFailed.value = false;
                    }, 3000);
                    return;
                } else if(response.response.data.message.includes('Too Many Attempts.')) {
                    registrationFailedMessage.value = 'Too many attempts. Please try again later.';
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

        const handleCancel = () => {
            navigationStore.closeRegistrationForm();
            navigationStore.openMenuModalItems();
        }

        const toggleBetaTermsAndConditions = () => {
            authStore.toggleBetaTermsAndConditions();
        }


        return {
            onSubmit,
            registrationFailed,
            registrationFailedMessage,
            handleCancel,
            toggleBetaTermsAndConditions,
            betaTermsActive
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
                    <Field name="username" type="text" placeholder="Username" :rules="{required: true, min: 3, max: 15, regex: /^[^#]*$/}" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="username" class="text-red"/>
                    <Field name="email" type="email" placeholder="Email" rules="required|email" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="email" class="text-red"/>
                    <Field name="password" type="password" placeholder="Password" :rules="{ required: true, min: 8, max: 32, regex: /^(?=.*[A-Z])(?=.*[!@#]).+$/ }" :validateOnBlur="false" :validateOnChange="true" class="bg-apex-blue" />
                    <ErrorMessage name="password" class="text-red" />
                    <Field v-slot="{ field }" name="betaTerms" type="checkbox" :value="true" :unchecked-value="false" rules="required">
                        <div class="flex flex-row space-x-2">
                            <div class="w-2px">
                                <input type="checkbox" name="betaTerms" class="" v-bind="field" :value="true" />
                            </div>
                            <div class="flex flex-row items-center">

                                <label for="betaTerms">I agree to the terms and conditions for the TrainingMode&trade; beta (<span class="text-apex-yellow" @click="toggleBetaTermsAndConditions()">{{betaTermsActive === true ? 'hide' : 'show'}}</span>)</label>
                            </div>
                        </div>
                    </Field>
                    <ErrorMessage name="betaTerms" class="text-red" />
                </div>
                <div class="flex flex-row justify-center space-x-2">
                    <button class="rounded border p-2 text-white bg-apex-blue w-1/3">Create account</button>
                    <button type="button" class="rounded border p-2 text-white bg-apex-blue w-1/3" @click="handleCancel()">Cancel</button>
                </div>
            </Form>
            <div class="mt-8 border rounded p-2 space-y-4 xs:h-[25rem] lg:h-[30rem] overflow-y-auto" :class="{ 'hidden': betaTermsActive === false }">
                <h1 class="text-2xl font-bold">TrainingMode&trade; App Beta Version Terms and Conditions</h1>
                <section class="space-y-2">
                    <p>Welcome to TrainingMode&trade;!</p>
                    <p>By creating an account, you are joining our beta program. We're excited to have you on board and look forward to your valuable contributions to improve the TrainingMode&trade; experience. Please be aware of the following important points regarding this beta version:</p>
                </section>
                <section>
                    <ol class="space-y-2">
                        <li>
                            <span class="text-apex-yellow font-bold">Beta Version:</span> You are accessing the beta version of TrainingMode&trade;. This means that you are among the first to try out new features. While not at all required, your feedback and suggestions will play a crucial role in shaping the final version of the app. If you feel so inclined, please share your thoughts with us on our official <a href="discord://discordapp.com/users/606732350256054282" class="pointer text-apex-yellow">Discord server</a>.
                        </li>
                        <li>
                            <span class="text-apex-yellow font-bold">Beta Period Pricing:</span> While TrainingMode&trade; is in its beta phase, you will have full access to all features at no cost. As we progress, we may introduce premium tiers with additional features or access privileges. Rest assured, a basic free tier will always be available. Upon the implementation of these tiers, all existing beta users would be automatically transitioned to the basic free tier, ensuring continuous access to fundamental features of TrainingMode&trade; and retainment of any data you've created within the app.
                        </li>
                        <li>
                            <span class="text-apex-yellow font-bold">Changes and Development:</span> As a participant in the beta, you will experience the app as it evolves. This includes regular updates, feature modifications, and the occasional introduction of entirely new functionalities. Our goal is to enhance your experience continuously.
                        </li>
                        <li>
                            <span class="text-apex-yellow font-bold">Data Preservation:</span> While we are committed to safeguarding your data, the nature of a beta program means that significant changes to the app can occur. These changes might lead to temporary unavailability or, in rare cases, loss of data. We will make every effort to prevent this and to inform you about major updates in advance.
                        </li>
                        <li>
                            <span>Data Privacy Commitment:</span> At TrainingMode&trade;, your privacy is paramount. We firmly believe in the protection and confidentiality of your data. We assure you that your personal information will never be distributed or sold to any third parties. Our use of data is exclusively internal and for analytical purposes only, aimed at enhancing and improving your app experience. Your trust is vital to us, and we are dedicated to maintaining the highest standards of data privacy.
                        </li>
                        <li>
                            <span class="text-apex-yellow font-bold">Your Role:</span> Your participation and feedback are invaluable. By using the app, reporting issues, and sharing your thoughts, you help us identify areas for improvement and innovation.
                        </li>
                    </ol>
                </section>
            </div>
        </div>
    </div>
</template>
<style scoped>
    input::placeholder {
        @apply text-white;
    }
</style>