<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
import { useGameStore } from '@/stores/GameStore';
import { computed } from 'vue';
import DirectionalInput from './DirectionalInput.vue';
import { directionalInputSets } from '@/common/utilities';

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

        const handleCannedDirectionsClick = (directionalInputSet) => {
            comboStore.addCannedDirectionalInputsToDisplay(directionalInputSet)
        }

        return {
            gameStore,
            comboStore,
            directions,
            getGameAbbreviation,
            getInputImgFilename,
            directionalInputSets,
            handleCannedDirectionsClick
        }
    },
    components: {
        DirectionalInput
    }
    
}
</script>
<template lang="">
    <div class="grid grid-rows-2 grid-cols-2">
        <div v-for="directionalInputSet in Object.keys(directionalInputSets)" class="xs:p-1 lg:p-2 border rounded text-center flex flex-col m-1" @click="handleCannedDirectionsClick(directionalInputSet)">
            <p class="xs:text-sm lg:text-2xl text-apex-yellow">
                {{ directionalInputSet.toUpperCase() }}
            </p>
            <p>
                {{ directionalInputSets[directionalInputSet].name }}
            </p>
        </div>
    </div>
</template>
<style lang="">
    
</style>