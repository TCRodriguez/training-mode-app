<script lang="ts">
import AttackButton from './AttackButton.vue';
import { useGameStore } from '@/stores/GameStore';
import { useComboStore } from '@/stores/ComboStore';

import { getGameAbbreviation, getInputImgFilename } from '@/common/helpers';

export default {
    setup(props) {
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        const renderAttackInput = (input: object) => {
            comboStore.addAttackButtonInputToDisplay(input)
        }
        return {
            gameStore,
            comboStore,
            renderAttackInput,
            getGameAbbreviation,
            getInputImgFilename
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
            v-for="attackButton in gameStore.getAttackButtonTriples"
            :key="attackButton.id"
            @click="renderAttackInput(attackButton)"
        >
            <AttackButton 
                :iconFileName="getInputImgFilename(attackButton.name)" 
                :game="getGameAbbreviation()" 
                :attack="attackButton"
                class="h-20 w-20" 
            />
        </div>
    </div>
</template>
<style lang="">
    
</style>