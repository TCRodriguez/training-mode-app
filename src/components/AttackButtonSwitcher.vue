<script lang="ts">
import AttackButtonSinglesGroup from './AttackButtonSinglesGroup.vue';
import AttackButtonDoublesGroup from './AttackButtonDoublesGroup.vue';
import AttackButtonTriplesGroup from './AttackButtonTriplesGroup.vue';
import { useGameStore } from '@/stores/GameStore';
import { ref } from 'vue';
export default {
    setup() {
        const gameStore = useGameStore();
        const attackButtonGroupSelection = ref('singles');
        return {
            gameStore,
            attackButtonGroupSelection
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
    <div class="flex flex-col items-center">
       <div>
            <AttackButtonSinglesGroup v-if = "attackButtonGroupSelection === 'singles'" :buttons="gameStore.game.buttons" />
       </div> 
       <div>
            <AttackButtonDoublesGroup v-if = "attackButtonGroupSelection === 'doubles'" />
       </div>
       <div>
            <AttackButtonTriplesGroup v-if = "attackButtonGroupSelection === 'triples'" />
       </div>
       <div class="flex flex-row text-yellow space-x-2">
            <button class="border rounded p-2" @click="attackButtonGroupSelection = 'singles'">1</button>
            <button class="border rounded p-2" @click="attackButtonGroupSelection = 'doubles'">2</button>
            <button class="border rounded p-2" @click="attackButtonGroupSelection = 'triples'">3</button>
        </div>
    </div>
</template>
<style lang="">
    
</style>