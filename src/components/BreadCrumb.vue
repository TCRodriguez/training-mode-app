<script lang="ts">
// import { useGameStore } from '@/stores/GameStore';
// import { useCharacterStore } from '@/stores/CharacterStore';
import { useNavigationStore } from '@/stores/NavigationStore';
import { useRouter } from 'vue-router';
export default {
    setup() {
        const navigationStore = useNavigationStore();
        const router = useRouter();
        const goToBreadCrumb = (type: string, link: string) => {
            router.replace(link);
            if(type === 'game' && navigationStore.navItems.length !== 1) {
                navigationStore.popCharacterNavItem();
            }
        }

        return {
            navigationStore,
            goToBreadCrumb,
            router
        }
    }
}
</script>
<template lang="">
    <div class="flex flex-row">
        <span 
            v-for="(item, index) in navigationStore.navItems" 
            :key="index"
            @click="goToBreadCrumb(item.type, item.link)"
            class="font-bold opacity-50"
        >
            {{ item.name }} / 
        </span>
    </div>
</template>
<style lang="">
    
</style>