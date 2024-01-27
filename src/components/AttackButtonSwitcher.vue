<script lang="ts">
import AttackButtonSinglesGroup from './AttackButtonSinglesGroup.vue';
import AttackButtonDoublesGroup from './AttackButtonDoublesGroup.vue';
import AttackButtonTriplesGroup from './AttackButtonTriplesGroup.vue';
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
    }    
}
</script>
<template lang="">
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-row text-yellow space-x-2">
            <button v-if="attackButtonDoubles.length > 0 && attackButtonTriples.length > 0" class="border rounded p-2" @click="attackButtonGroupSelection = 'singles'">1</button>
            <button v-if="attackButtonDoubles.length > 0" class="border rounded p-2" @click="attackButtonGroupSelection = 'doubles'">2</button>
            <button v-if="attackButtonTriples.length > 0" class="border rounded p-2" @click="attackButtonGroupSelection = 'triples'">3</button>
        </div>
       <div>
            <AttackButtonSinglesGroup v-if = "attackButtonGroupSelection === 'singles'" :buttons="gameStore.game.buttons" />
       </div> 
       <div>
            <AttackButtonDoublesGroup v-if = "attackButtonGroupSelection === 'doubles'" />
       </div>
       <div>
            <AttackButtonTriplesGroup v-if = "attackButtonGroupSelection === 'triples'" />
       </div>

    </div>
</template>
<style lang="">
    
</style>