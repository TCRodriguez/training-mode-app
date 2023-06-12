<script lang="ts">
import BreadCrumb from "@/components/BreadCrumb.vue";
import ExitOutlineIcon from "@/components/icons/ExitOutlineIcon.vue";
import PersonOutlineIcon from "./icons/PersonOutlineIcon.vue";
import LoginOutlineIcon from "./icons/LoginOutlineIcon.vue";
import ChevronBackOutlineIcon from "./icons/ChevronBackOutlineIcon.vue";
import LoginModal from "@/components/LoginModal.vue"
import { useAuthStore } from "@/stores/AuthStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useRouter, useRoute, createWebHistory } from "vue-router";
import { computed } from "vue";
    export default {
        setup() {
            const authStore = useAuthStore();
            const navigationStore = useNavigationStore();
            const clearBreadCrumbs = () => {
                navigationStore.clearNavItems();
            }
            const route = useRoute();
            const router = useRouter();
            const history = createWebHistory();

            const logout = () => {
                if(window.confirm('Are you sure you want to logout?')) {
                    authStore.logout()
                    .then(() => {
                        navigationStore.clearNavItems();
                        router.replace('/');
                        // TODO Clear history and redirect to home/dashboard?

                    });
                }
            }

            const goBack = () => {
                if(route.name === 'games') {
                    return;
                }
                router.back();
            }

            const loginModalActive = computed(() => authStore.loginFormActive);

            const toggleLoginModal = () => {
                authStore.toggleLoginModal();
            }

            return {
                authStore,
                navigationStore,
                route,
                clearBreadCrumbs,
                logout,
                history,
                goBack,
                toggleLoginModal,
                loginModalActive
            }
        },
        components: {
            BreadCrumb,
            ExitOutlineIcon,
            ChevronBackOutlineIcon,
            PersonOutlineIcon,
            LoginOutlineIcon,
            LoginModal
        }
    }
</script>
<template lang="">
    <div class="p-2">
        <nav>
            <div class="flex flex-row justify-between items-center">
                <div class="flex flex-row items-center">
                    <ChevronBackOutlineIcon :class="{ 'invisible': route.name === 'dashboard'}" class="w-10 h-10" @click="goBack()"/>
                </div>
                <div class="flex flex-col items-center">
                    <div class="flex flex-row">
                        <router-link to="/" class="font-bold text-xl" @click="clearBreadCrumbs()">TrainingMode</router-link>
                        <p class="text-[.50rem]">TM</p>
                    </div>
                    <div class="flex justify-center items-center space-x-1">
                        <!-- TODO Show username here if logged in -->
                        <PersonOutlineIcon class="h-5 w-5" />
                        <p v-if="authStore.loggedInUser === null">Guest</p>
                        <p v-else>{{ authStore.loggedInUser.username }}</p>
                    </div>

                </div>
                <div class="">
                    <LoginOutlineIcon v-if="authStore.loggedInUser === null" class="h-10 w-10" @click="toggleLoginModal()"/>
                    <ExitOutlineIcon v-else @click="logout()" class="h-10 w-10" />
                </div>
            </div>
            <div class="hidden">
            </div>
            <BreadCrumb class="hidden" />
            <div class="bg-black opacity-[.85] fixed h-screen w-full top-0 left-0 right-0 bottom-0" :class="{ 'hidden': loginModalActive === false }"></div>
            <div>
                <div class="absolute h-screen top-0 bottom-0 right-0 left-0 pt-2 flex flex-col justify-between justify-center" :class="{'hidden': loginModalActive === false }">
                    <div class="h-full flex flex-col justify-center m-2">
                        <div class="bg-gray">
                            <LoginModal class="p-2 m-2" @trigger-toggle-login-modal="toggleLoginModal()" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<style lang="">
    
</style>