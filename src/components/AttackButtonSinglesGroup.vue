<script lang="ts">
import { useGameStore } from '@/stores/GameStore';
import { useComboStore } from '@/stores/ComboStore';
import { toRaw, ref, computed } from 'vue';
import AttackButton from './AttackButton.vue';

import { getGameAbbreviation, getInputImgFilename } from '@/common/helpers';
export default {
    setup(props) {
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        const attackButtonSingles = gameStore.getAttackButtonSingles;
        const renderAttackInput = (input: object) => {
            comboStore.addAttackButtonInputToDisplay(input)
        }
        return {
            gameStore,
            comboStore,
            attackButtonSingles,
            renderAttackInput,
            getGameAbbreviation,
            getInputImgFilename
        }
        
    },
    props: {
        buttons: String
    },
    components: {
        AttackButton
    }
}
</script>
<template lang="">
    <div class="grid grid-rows-2 grid-cols-2" :class="{'grid-cols-3': buttons === '6' }">
        <div
            v-for="attackButton in gameStore.getAttackButtonSingles"
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