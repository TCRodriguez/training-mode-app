<script lang="ts">
import BreadCrumb from "@/components/BreadCrumb.vue";
import ExitOutlineIcon from "@/components/icons/ExitOutlineIcon.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useRouter } from "vue-router";
// import { clearPiniaState } from "@/common/helpers";
    export default {
        setup() {
            const authStore = useAuthStore();
            const navigationStore = useNavigationStore();
            const clearBreadCrumbs = () => {
                navigationStore.clearNavItems();
            }
            const router = useRouter();

            const logout = () => {
                if(window.confirm('Are you sure you want to logout?')) {
                    authStore.logout()
                    .then(() => {
                        navigationStore.clearNavItems();
                        router.replace('/');
                    });
                }
            }
            return {
                authStore,
                navigationStore,
                clearBreadCrumbs,
                logout
            }
        },
        components: {
            BreadCrumb,
            ExitOutlineIcon
        }
    }
</script>
<template lang="">
    <div>
        <div class="flex flex-row justify-between">
            <nav>
                <router-link to="/games" class="font-bold text-4xl" @click="clearBreadCrumbs()">TrainingMode</router-link>
            </nav>
            <div class="">

                <!-- <p>Logout</p> -->
                <ExitOutlineIcon class="h-10 w-10" @click="logout()" />
            </div>
        </div>
        <div>
            Welcome, {{authStore.loggedInUser.username}}
        </div>
        <BreadCrumb />
    </div>
</template>
<style lang="">
    
</style>