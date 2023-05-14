<script lang="ts">
import BreadCrumb from "@/components/BreadCrumb.vue";
import { useNavigationStore } from "@/stores/NavigationStore";
    export default {
        setup() {
            const navigationStore = useNavigationStore();
            const clearBreadCrumbs = () => {
                navigationStore.clearNavItems();
            }
            return {
                navigationStore,
                clearBreadCrumbs
            }
        },
        components: {
            BreadCrumb
        }
    }
</script>
<template lang="">
    <div>
        <nav>
            <router-link to="/" class="font-bold text-4xl" @click="clearBreadCrumbs()">TrainingMode</router-link>
        </nav>
        <BreadCrumb />
    </div>
</template>
<style lang="">
    
</style>