<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
import { useGameStore } from '@/stores/GameStore';
import { computed } from 'vue';
import DirectionalInput from './DirectionalInput.vue';
export default {
    props: {
        directions: String,
        directionalInputId: String
    },
    setup() {
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        const directions = computed(() => gameStore.directionalInputs);
        const renderComboInput = (input: string) => {
            comboStore.addComboInputToDisplay(input)
        }
        const renderDirectionalInput = (input) => {
            comboStore.addDirectionalInputToDisplay(input)
        }

        return {
            gameStore,
            comboStore,
            directions,
            renderComboInput,
            renderDirectionalInput
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
            v-for="direction in gameStore.getDirectionalInputTaps" 
            :key="direction.id"
            @click="renderDirectionalInput(direction)"
            class="flex flex-col"
        >
            <DirectionalInput :iconFileName="direction.icon_file_name" :game="gameStore.game.abbreviation" class="h-20 w-20"/>
        </div>
    </div>
</template>
<style lang="">
    
</style>