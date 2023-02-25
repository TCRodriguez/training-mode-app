<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { computed, ref, watch } from 'vue';
import AttackButton from '@/components/AttackButton.vue';
import DirectionalInput from './DirectionalInput.vue';
import CharacterNotation from './CharacterNotation.vue';
import GameNotation from './GameNotation.vue';

export default {
    setup() {
        const comboStore = useComboStore();
        const characterStore = useCharacterStore();
        const comboDisplay = computed(() => comboStore.comboDisplay);
        let fullScreenActiveBool = ref(false);
        const enterFullScreen = () => {
            let comboDisplay = document.querySelector('#combo-display');
            comboDisplay?.requestFullscreen();
        };
        
        addEventListener('fullscreenchange', (event) => {
            console.log("Full screen exited.")
            fullScreenActiveBool.value = !fullScreenActiveBool.value;
        });

        watch(() => characterStore.character, () => {
            console.log('character has changed');
            comboStore.comboDisplay = [];
        });

        return {
            comboStore,
            characterStore,
            comboDisplay,
            enterFullScreen,
            fullScreenActiveBool,
            // toggleAutoScroll
        }
    },
    components: {
        AttackButton,
        DirectionalInput,
        CharacterNotation,
        GameNotation
    },
    beforeUnmount() {
        removeEventListener('fullscreenchange', () => {});
    },
}
</script>
<template lang="">
    <div class="border space-x-2 flex flex-row overflow-x-auto items-center" id="combo-display">
        <div
            v-for="comboInput in comboDisplay"
            :key="comboInput.id"
            class="shrink-0"
        >
            <AttackButton 
                v-if="comboInput.category === 'attack-buttons'" :iconFileName="comboInput.icon_file_name"
                :class="{ 'h-96 w-96': fullScreenActiveBool, 'h-12 w-12': !fullScreenActiveBool}"

            />
            <DirectionalInput 
                v-else-if="comboInput.category === 'directional-inputs'" :iconFileName="comboInput.icons[0].icon_file_name"
                :class="{ 'h-96 w-96': fullScreenActiveBool, 'h-12 w-12': !fullScreenActiveBool}"
            />
            <CharacterNotation 
                v-else-if="comboInput.notations_group === 'character'" :notation="comboInput.notation"
                :class="{ 'h-96 w-96': fullScreenActiveBool, 'h-12 w-12': !fullScreenActiveBool}"
            />
            <GameNotation 
                v-else :notation="comboInput.notation"
                :class="{ 'text-9xl': fullScreenActiveBool}"
                class="fill-green-400 p-2 h-10 w-10"
                :isFullScreen="fullScreenActiveBool"

                :iconFileName="comboInput.icon_file_name"
            />
        </div>
    </div>
    <div class="flex flex-row justify-center space-x-5">
        <button class="bg-yellow-500" @click="comboStore.eraseComboInput">Erase</button>
        <button class="bg-red-500" @click="comboStore.clearComboDisplay">Clear</button>
        <button class="bg-green-500" @click="enterFullScreen()">Go Fullscreen</button>
    </div>
</template>
<style lang="">
    
</style>