<script lang="ts">
import AttackButton from './AttackButton.vue';
import { useGameStore } from '@/stores/GameStore';
import { useComboStore } from '@/stores/ComboStore';
import { computed } from 'vue';

import { getGameAbbreviation, getInputImgFilename } from '@/common/helpers';

export default {
    setup(props) {
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        const renderAttackInput = (input: object) => {
            comboStore.addAttackButtonInputToDisplay(input)
        }

        const attackButtonDoubles = computed(() => gameStore.getAttackButtonDoubles);

        const test = gameStore.getAttackButtonDoubles;
        return {
            gameStore,
            comboStore,
            renderAttackInput,
            getGameAbbreviation,
            getInputImgFilename,
            attackButtonDoubles
        }
    },
    components: {
        AttackButton
    }
}
</script>
<template lang="">
    <div class="grid grid-rows-2 grid-cols-2">
        <div
            v-for="attackButton in attackButtonDoubles"
            :key="attackButton.id"
            @click="renderAttackInput(attackButton)"
        >
            <AttackButton 
                :iconFileName="getInputImgFilename(attackButton.name)" 
                :game="getGameAbbreviation()" class="h-20 w-20" 
                :attack="attackButton"
            />
        </div>
    </div>
</template>
<style lang="">
    
</style>