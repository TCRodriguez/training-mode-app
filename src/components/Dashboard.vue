<script lang=ts>
import { useRouter } from 'vue-router';
import { useNavigationStore } from '@/stores/NavigationStore';
import { computed } from 'vue';
import DashboardItem from './DashboardItem.vue';
export default {
    setup() {
        const router = useRouter();
        const navigationStore = useNavigationStore();
        const dashboardItems = computed(() => navigationStore.dashboardItems);
        

        return {
            router,
            navigationStore,
            dashboardItems
        }
    },
    components: {
        DashboardItem
    }
}
</script>
<template lang="">
    <div>
        <div class="flex flex-row px-2">
            <div v-for="item in dashboardItems" :key="item" class="border rounded">
                <RouterLink :to="item.link">
                    <DashboardItem :name="item.name" :icon="item.icon" class="p-4 fill-white" />
                </RouterLink>

            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>