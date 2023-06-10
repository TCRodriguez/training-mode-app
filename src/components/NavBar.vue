<script lang="ts">
import BreadCrumb from "@/components/BreadCrumb.vue";
import ExitOutlineIcon from "@/components/icons/ExitOutlineIcon.vue";
import ChevronBackOutlineIcon from "./icons/ChevronBackOutlineIcon.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useRouter, useRoute, createWebHistory } from "vue-router";
// import { clearPiniaState } from "@/common/helpers";
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
                    });
                }
            }

            const goBack = () => {
                // router.back();
                if(route.name === 'games') {
                    return;
                }
                router.back();
                // console.log(history.state.current);
                console.log(history)
                // console.log(route.name);

            }
            return {
                authStore,
                navigationStore,
                route,
                clearBreadCrumbs,
                logout,
                history,
                goBack,
            }
        },
        components: {
            BreadCrumb,
            ExitOutlineIcon,
            ChevronBackOutlineIcon
        }
    }
</script>
<template lang="">
    <div>
        <nav>
            <div class="flex flex-row justify-between items-center">
                <div class="flex flex-row items-center">
                    <ChevronBackOutlineIcon :class="{ 'invisible': route.name === 'games'}" class="w-10 h-10" @click="goBack()"/>
                    <!-- <p>{{ history.location }}</p> -->
                </div>
                <div class="flex flex-row">
                    <router-link to="/games" class="font-bold text-xl" @click="clearBreadCrumbs()">TrainingMode</router-link>
                    <p class="text-[.50rem]">TM</p>
                </div>
                <div class="">
                <!-- <p>Logout</p> -->
                <ExitOutlineIcon class="h-10 w-10" @click="logout()" />
                </div>
            </div>
            <div class="hidden">
                Welcome, {{authStore.loggedInUser.username}}
            </div>
            <BreadCrumb class="hidden" />
        </nav>
    </div>
</template>
<style lang="">
    
</style>