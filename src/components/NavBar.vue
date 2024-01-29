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
import RegistrationModal from "./RegistrationModal.vue";
import RequestResetPasswordModal from "./RequestResetPasswordModal.vue";
import ResetPasswordForm from "./ResetPasswordForm.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useRouter, useRoute, createWebHistory } from "vue-router";
import { computed } from "vue";
import { useAppMetadataStore } from "@/stores/AppMetadataStore";
import { closeMenu } from "@/common/helpers";
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
            const registrationFormActive = computed(() => navigationStore.registrationFormActive);

            const toggleLoginModal = () => {
                authStore.toggleLoginModal();
            }

            const openLoginForm = () => {
                authStore.openLoginForm();
            }

            const toggleMenuModal = () => {
                navigationStore.toggleMenuModalContainer();
            }

            const toggleMenuModalItems = () => {
                navigationStore.toggleMenuModalItems();
            }

            const handleCloseRegistrationForm = (userRegistered: boolean) => {
                navigationStore.closeRegistrationForm();
            }

            const handleOpenRegistrationForm = () => {
                navigationStore.openRegistrationForm();
                authStore.closeLoginForm();
                navigationStore.toggleMenuModalItems();
            }

            const env = import.meta.env.VITE_APP_ENV;
            const appVersion = import.meta.env.VITE_APP_VERSION;

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
                appVersion,
                toggleMenuModal,
                toggleMenuModalItems,
                registrationFormActive,
                handleCloseRegistrationForm,
                closeMenu,
                handleOpenRegistrationForm,
                openLoginForm

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
            MenuModal,
            RegistrationModal,
            RequestResetPasswordModal,
            ResetPasswordForm

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
                        <router-link to="/" class="font-bold text-xl flex flex-col justify-center items-center" @click="clearBreadCrumbs()">
                            <div class="flex flex-row justify-center">
                                <img src="/src/assets/Training_Mode_Logo_White.png" alt="" class="xs:w-5/6 lg:w-1/3">
                                <p class="text-[.50rem] font-bold">TM</p>
                            </div>
                            <div>
                                <p class="text-sm">( Beta v{{ appVersion }} )</p>
                            </div>
                            <div v-if="authStore.loggedInUser && authStore.loggedInUser.username === 'nightbass_'" >
                                <div>
                                    <p class="text-xs">{{ env }}</p>
                                </div>
                            </div>
                        </router-link>
                    </div>
                    <div class="flex justify-center items-center space-x-1 mt-2 text-lg">
                        <PersonOutlineIcon class="h-5 w-5" />
                        <p v-if="authStore.loggedInUser === null">Guest</p>
                        <p v-else>{{ authStore.loggedInUser.username.includes('#') ? authStore.loggedInUser.username.split('#')[0] : authStore.loggedInUser.username }}</p>
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
                    <div id="menu-overlay" class="h-full flex flex-col justify-center items-center m-2 z-50">
                        <!-- TODO Should we move these stylings into the LoginModal component? -->
                        <MenuModal 
                            v-if="navigationStore.menuModalItemsActive" 
                            @trigger-toggle-login-modal="toggleLoginModal(), toggleMenuModalItems()" 
                            @trigger-open-registration-form="handleOpenRegistrationForm()"
                        />
                        <div :class="{'hidden': loginModalActive === false }" class="z-50 lg:w-1/2">
                            <LoginModal class="p-2 m-2 bg-apex-blue" @trigger-toggle-login-modal="toggleLoginModal(), toggleMenuModal()" />
                        </div>
                        <div :class="{'hidden': registrationFormActive === false }" class="z-50 lg:w-1/2">
                            <RegistrationModal 
                                class="p-2 m-2 bg-apex-blue" 
                                @trigger-open-login-form="openLoginForm()"
                                @trigger-close-registration-form="handleCloseRegistrationForm" 
                                @trigger-close-menu="closeMenu()" 
                            />
                        </div>
                        <div :class="{'hidden': authStore.requestPasswordResetFormActive === false }" class="z-50 lg:w-1/2">
                            <RequestResetPasswordModal
                                @trigger-close-menu="closeMenu()"
                                class="p-2 m-2 bg-apex-blue" 
                            />
                        </div>
                        <div :class="{'hidden': authStore.passwordResetFormActive === false }" class="z-50 lg:w-1/2">
                            <ResetPasswordForm
                                @trigger-close-menu="closeMenu()"
                                class="p-2 m-2 bg-apex-blue" 
                            />
                        </div>
                        
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<style lang="">
    
</style>