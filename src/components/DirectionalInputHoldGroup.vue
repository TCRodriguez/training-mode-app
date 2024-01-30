<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
import { useGameStore } from '@/stores/GameStore';
import { computed } from 'vue';
import DirectionalInput from './DirectionalInput.vue';

import { getGameAbbreviation, getInputImgFilename } from '@/common/helpers';
export default {
    props: {
        directions: String,
        directionalInputId: String
    },
    setup() {
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        const directions = computed(() => gameStore.directionalInputs);
        const renderDirectionalInput = (input: object) => {
            comboStore.addDirectionalInputToDisplay(input)
        }

        return {
            gameStore,
            comboStore,
            directions,
            renderDirectionalInput,
            getGameAbbreviation,
            getInputImgFilename
        }
    },
    components: {
        DirectionalInput
    }
    
}
</script>
<template lang="">
    <div class="grid grid-rows-3 grid-cols-3">
        <div
            v-for="direction in gameStore.getDirectionalInputHolds" 
            :key="direction.id"
            @click="renderDirectionalInput(direction)"
        >
            <DirectionalInput 
                :iconFileName="getInputImgFilename(direction.direction)" 
                :game="getGameAbbreviation()" 
                :direction="direction" 
                class="xs:h-16 xs:w-16 h-20 w-20"
            />
        </div>
    </div>
</template>
<style lang="">
    
</style>