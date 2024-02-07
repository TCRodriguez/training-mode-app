<script lang="ts" setup>
import { useNavigationStore } from '@/stores/NavigationStore';
import { useAuthStore } from '@/stores/AuthStore';
import LoginOutlineIcon from "./icons/LoginOutlineIcon.vue";
import ExitOutlineIcon from "@/components/icons/ExitOutlineIcon.vue";
import CloseIcon from "./icons/CloseIcon.vue";
import AddUserIcon from './icons/AddUserIcon.vue';
import PatreonIcon from './icons/PatreonIcon.vue';
import PayPalIcon from './icons/PayPalIcon.vue';
import DiscordIcon from './icons/DiscordIcon.vue';
import { closeMenu } from '@/common/helpers';
import { showToast } from '@/common/helpers';

const navigationStore = useNavigationStore();
const authStore = useAuthStore();

const handleLogout = () => {
    authStore.logout()
    .then(() => {
        closeMenu();
        showToast('Logout successful!', 3000, 'success');
    });
}


</script>
<template lang="">
    <div class="xs:w-4/5 xl:w-1/3">
        <div class="border rounded-sm bg-apex-blue flex flex-col justify-center p-2 xs:text-xl xl:text-4xl">
            <div class="flex justify-end">
                <CloseIcon class="h-10 w-10" @click="closeMenu()" />
            </div>
            <div class="xs:space-y-4 xl:space-y-8">
                <div class="">
                    <div class="flex flex-row items-center space-x-2" @click="$emit('triggerToggleLoginModal')">
                        <LoginOutlineIcon v-if="authStore.loggedInUser === null" class="xs:h-10 xs:w-10 lg:h-20 lg:w-20 h-10 w-10" />
                        <p v-if="authStore.loggedInUser === null">Login</p>
                    </div>
                    <div class="flex flex-row items-center space-x-2" @click="handleLogout()">
                        <ExitOutlineIcon v-if="authStore.loggedInUser !== null" class="xs:h-10 xs:w-10 lg:h-20 lg:w-20 h-10 w-10" />
                        <p v-if="authStore.loggedInUser !== null">Logout</p>
                    </div>
                </div>
                <div v-if="authStore.loggedInUser === undefined || authStore.loggedInUser === null" class="flex flex-row items-center space-x-2" @click="$emit('triggerOpenRegistrationForm', false)">
                    <AddUserIcon class="xs:h-10 xs:w-10 lg:h-20 lg:w-20 h-10 w-10" />
                    <p>Register</p>
                </div>
                <div class="flex flex-row items-center">
                    <a href="discord://discordapp.com/users/606732350256054282" class="flex flex-row items-center space-x-2">
                        <DiscordIcon class="h-10 w-10 lg:h-20 lg:w-20 fill-white" />
                        <p>Join us on Discord!</p>
                    </a>
                </div>
                <div class="flex flex-row items-center">
                    <a href="https://twitter.com/trainingmodeapp" target="_blank" class="flex flex-row items-center space-x-2">
                        <p class="xs:text-sm lg:text-3xl">Follow us on </p>
                        <img
                            src="https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/branding-stuff/tm-twitter-badge(no-background).png" 
                            class="xs:w-1/2"
                            alt="Twitter link"
                        >
                    </a>
                </div>
                <div class="space-y-4">
                    <p class="xs:text-sm lg:text-xl text-center">Support the development of TrainingMode through any of these platforms:</p>
                    <div class="flex flex-row space-x-4 justify-center items-center">
                        <div>
                            <a href="https://www.patreon.com/TCRodriguez" target="_blank">
                                <PatreonIcon class="h-10 w-10 fill-white" />
                            </a>
                        </div>
                        <div class="xs:w-1/3 lg:w-1/5">
                            <a href="https://ko-fi.com/tcrodriguez" target="_blank">
                                <img src="/src/assets/ko-fi_logo_white_stroke.png" alt="" class="">
                            </a>
                        </div>
                        <div>
                            <a href="https://paypal.me/tcrodriguez1?country.x=US&locale.x=en_US" target="_blank">
                                <PayPalIcon class="h-10 w-10 fill-white" />
                            </a>
                        </div>
                    </div>
                </div>
                <div class="mt-8 text-sm text-center">
                    <p>If you have any questions or need assistance please reach us at <a href="mailto:support@trainingmode.gg" class="text-apex-yellow">support@trainingmode.gg</a></p>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="">


</style>