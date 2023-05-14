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
            // const test = gameStore.getDirectionalInputTaps;
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
        <!-- <img
            v-for="direction in directions" 
            :key="direction.id"
            @click="renderComboInput(direction)"
            height="150"
            width="150"
            :alt="direction.direction"
            :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/directional-inputs%2F${direction.icon_file_name}`"
        > -->
        <div
            v-for="direction in gameStore.getDirectionalInputTaps" 
            :key="direction.id"
            @click="renderDirectionalInput(direction)"
            class="flex flex-col"
        >
            <DirectionalInput :iconFileName="direction.icons[0].icon_file_name" class="h-20 w-20"/>
        </div>
    </div>
</template>
<style lang="">
    
</style>