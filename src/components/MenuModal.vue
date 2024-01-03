<script lang="ts" setup>
import { useNavigationStore } from '@/stores/NavigationStore';
import { useAuthStore } from '@/stores/AuthStore';
import LoginOutlineIcon from "./icons/LoginOutlineIcon.vue";
import ExitOutlineIcon from "@/components/icons/ExitOutlineIcon.vue";
import CloseIcon from "./icons/CloseIcon.vue";

const navigationStore = useNavigationStore();
const authStore = useAuthStore();


</script>
<template lang="">
    <div class="w-1/2">
        <div class="border rounded-sm bg-apex-blue flex flex-col justify-center p-2">
            <div class="flex justify-end">
                <CloseIcon class="h-10 w-10" @click="navigationStore.toggleMenuModalContainer(), navigationStore.toggleMenuModalItems()" />
            </div>
            <div class="flex flex-row items-center">
                <LoginOutlineIcon v-if="authStore.loggedInUser === null" class="h-10 w-10" @click="$emit('triggerToggleLoginModal')" />
                <p v-if="authStore.loggedInUser === null">Login</p>
                <ExitOutlineIcon v-if="authStore.loggedInUser !== null" class="h-10 w-10" @click="authStore.logout()" />
                <p v-if="authStore.loggedInUser !== null">Logout</p>
            </div>
            <div>
                <p>Want to help beta test TrainingMode?</p>
                <p>Join us on <a href="https://discord.gg/zPkf2fXPtc" class="text-yellow">Discord!</a></p>
            </div>
            <!-- <div>
                <p>Register</p>
            </div>
            <div>
                <p>Support / Donate</p>
            </div> -->
        </div>
    </div>
</template>
<style lang="">


</style>