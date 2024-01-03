<script lang="ts">
import BreadCrumb from "@/components/BreadCrumb.vue";
import ExitOutlineIcon from "@/components/icons/ExitOutlineIcon.vue";
import PersonOutlineIcon from "./icons/PersonOutlineIcon.vue";
import LoginOutlineIcon from "./icons/LoginOutlineIcon.vue";
import ChevronBackOutlineIcon from "./icons/ChevronBackOutlineIcon.vue";
import MenuIcon from "./icons/MenuIcon.vue";
import CloseIcon from "./icons/CloseIcon.vue";
import MenuModal from "./MenuModal.vue";
import LoginModal from "@/components/LoginModal.vue"
import { useAuthStore } from "@/stores/AuthStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useRouter, useRoute, createWebHistory } from "vue-router";
import { computed } from "vue";
import { useAppMetadataStore } from "@/stores/AppMetadataStore";
    export default {
        setup() {
            const authStore = useAuthStore();
            const navigationStore = useNavigationStore();
            const appMetadataStore = useAppMetadataStore();
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
                        //Test

                    });
                }
            }

            const goBack = () => {
                // if(route.name === 'games') {
                //     return;
                // }
                router.back();
            }

            const loginModalActive = computed(() => authStore.loginFormActive);

            const toggleLoginModal = () => {
                authStore.toggleLoginModal();
            }

            const toggleMenuModal = () => {
                navigationStore.toggleMenuModalContainer();
            }

            const toggleMenuModalItems = () => {
                navigationStore.toggleMenuModalItems();
            }

            const env = window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1') ? 'develop' : 'production';

            return {
                authStore,
                navigationStore,
                appMetadataStore,
                route,
                clearBreadCrumbs,
                logout,
                history,
                goBack,
                toggleLoginModal,
                loginModalActive,
                env,
                toggleMenuModal,
                toggleMenuModalItems
            }
        },
        components: {
            BreadCrumb,
            ExitOutlineIcon,
            ChevronBackOutlineIcon,
            PersonOutlineIcon,
            LoginOutlineIcon,
            LoginModal,
            MenuIcon,
            CloseIcon,
            MenuModal
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
                        <!-- <router-link to="/" class="font-bold text-xl" @click="clearBreadCrumbs()">TrainingMode</router-link> -->
                        <router-link to="/" class="font-bold text-xl flex justify-center" @click="clearBreadCrumbs()">
                            <div class="flex flex-row justify-center">
                                <img src="/src/assets/Training_Mode_Logo_White.png" alt="" class="xs:w-5/6 lg:w-1/3">
                                <p class="text-[.50rem] font-bold">TM</p>
                            </div>
                        </router-link>
                    </div>
                    <div v-if="authStore.loggedInUser?.username === 'NiGHTBass'" class="flex flex-row">
                        <p>{{env}}</p>
                        <p class="px-1">{{'-'}}</p>
                        <p>v{{ appMetadataStore.appVersion }}</p>
                    </div>
                    <div class="flex justify-center items-center space-x-1">
                        <!-- TODO Show username here if logged in -->
                        <PersonOutlineIcon class="h-5 w-5" />
                        <p v-if="authStore.loggedInUser === null">Guest</p>
                        <p v-else>{{ authStore.loggedInUser.username }}</p>
                    </div>

                </div>
                <div class="">
                    <MenuIcon class="h-10 w-10" @click="toggleMenuModal(), toggleMenuModalItems()" />
                    <!-- <MenuModal :class="{ 'hidden': navigationStore.menuModalActive === false }" /> -->
                    <!-- <CloseIcon class="h-10 w-10" /> -->
                    <!-- <LoginOutlineIcon v-if="authStore.loggedInUser === null" class="h-10 w-10" @click="toggleLoginModal()"/>
                    <ExitOutlineIcon v-else @click="logout()" class="h-10 w-10" /> -->
                </div>
            </div>
            <div class="hidden">
            </div>
            <!-- TODO Get rid of this BreadCrumb component -->
            <BreadCrumb class="hidden" />
            <div class="bg-black opacity-[.85] fixed h-screen w-full top-0 left-0 right-0 bottom-0 z-40" :class="{ 'hidden': navigationStore.menuModalContainerActive === false }"></div>
            <div class="">
                <div class="absolute h-screen top-0 bottom-0 right-0 left-0 pt-2 flex flex-col justify-between justify-center" :class="{'hidden': navigationStore.menuModalContainerActive === false }">
                    <div class="h-full flex flex-col justify-center items-center m-2 z-50">
                        <!-- TODO Should we move these stylings into the LoginModal component? -->
                        <MenuModal v-if="navigationStore.menuModalItemsActive" @trigger-toggle-login-modal="toggleLoginModal(), toggleMenuModalItems()" />
                        <div :class="{'hidden': loginModalActive === false }" class="z-50 lg:w-1/2">
                            <LoginModal class="p-2 m-2 bg-apex-blue" @trigger-toggle-login-modal="toggleLoginModal(), toggleMenuModal()" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<style lang="">
    
</style>