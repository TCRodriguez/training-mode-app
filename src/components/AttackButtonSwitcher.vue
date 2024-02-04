<script lang="ts">
import AttackButtonSinglesGroup from './AttackButtonSinglesGroup.vue';
import AttackButtonDoublesGroup from './AttackButtonDoublesGroup.vue';
import AttackButtonTriplesGroup from './AttackButtonTriplesGroup.vue';
import HelpCircleOutlineIcon from './icons/HelpCircleOutlineIcon.vue';
import { useGameStore } from '@/stores/GameStore';
import { ref, computed } from 'vue';
export default {
    setup() {
        const gameStore = useGameStore();
        const attackButtonGroupSelection = ref('singles');
        
        const attackButtonDoubles = computed(() => gameStore.getAttackButtonDoubles);
        const attackButtonTriples = computed(() => gameStore.getAttackButtonTriples);



        return {
            gameStore,
            attackButtonGroupSelection,
            attackButtonDoubles,
            attackButtonTriples
        }
    },
    components: {
        AttackButtonSinglesGroup,
        AttackButtonDoublesGroup,
        AttackButtonTriplesGroup,
        HelpCircleOutlineIcon
    }    
}
</script>
<template lang="">
    <div class="">
        <div class="flex flex-col items-center justify-start">
            <div class="flex flex-row text-yellow space-x-2">
                <button v-if="attackButtonDoubles.length > 0 && attackButtonTriples.length > 0" class="p-2" :class="{ 'border rounded': attackButtonGroupSelection === 'singles'}" @click="attackButtonGroupSelection = 'singles'">1</button>
                <button v-if="attackButtonDoubles.length > 0" class="p-2" :class="{ 'border rounded': attackButtonGroupSelection === 'doubles'}" @click="attackButtonGroupSelection = 'doubles'">2</button>
                <button v-if="attackButtonTriples.length > 0" class="p-2" :class="{ 'border rounded': attackButtonGroupSelection === 'triples'}" @click="attackButtonGroupSelection = 'triples'">3</button>
                <div class="flex justify-end w-full items-center">
                    <HelpCircleOutlineIcon class="h-8 w-8 text-white fill-white" @click="$emit('triggerOpenAttackButtonLegendOverlay')" />
                </div>
            </div>
            <div class="overflow-y-auto h-[20rem]">
                <div v-if = "attackButtonGroupSelection === 'singles'">
                    <AttackButtonSinglesGroup :buttons="gameStore.game.buttons" />
                </div> 
                <div v-if = "attackButtonGroupSelection === 'doubles'">
                    <AttackButtonDoublesGroup />
                </div>
                <div v-if = "attackButtonGroupSelection === 'triples'">
                    <AttackButtonTriplesGroup />
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>