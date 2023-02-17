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

        return {
            gameStore,
            comboStore,
            directions,
            renderComboInput
        }
    },
    components: {
        DirectionalInput
    }
    
}
</script>
<template lang="">
    <div class="grid grid-rows-3 grid-cols-3 bg-blue-500">
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
            v-for="direction in directions" 
            :key="direction.id"
            @click="renderComboInput(direction)"
        >
            <DirectionalInput :iconFileName="direction.icon_file_name" class="h-24 w-24"/>
        </div>
    </div>
</template>
<style lang="">
    
</style>