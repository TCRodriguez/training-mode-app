<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { useGameStore } from '@/stores/GameStore';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import AttackButton from '@/components/AttackButton.vue';
import DirectionalInput from './DirectionalInput.vue';
import CharacterNotation from './CharacterNotation.vue';
import GameNotation from './GameNotation.vue';
import { getGameAbbreviation, getInputImgFilename } from '@/common/helpers';

export default {
    setup() {
        const comboStore = useComboStore();
        const characterStore = useCharacterStore();
        const gameStore = useGameStore();
        const comboInputs = computed(() => comboStore.comboInputsDisplay);
        const { getInput } = storeToRefs(gameStore);
        let fullScreenActiveHorizontalBool = ref(false);
        let fullScreenActiveVerticalBool = ref(false);
        const enterFullScreen = () => {
            let comboDisplay = document.querySelector('#horizontal-combo-display');
            comboDisplay?.requestFullscreen();
        };
        
        addEventListener('fullscreenchange', (event) => {
            switch (event.target.id) {
                case 'horizontal-combo-display':
                    fullScreenActiveHorizontalBool.value = !fullScreenActiveHorizontalBool.value;
                    break;
                case 'vertical-combo-display':
                    fullScreenActiveVerticalBool.value = !fullScreenActiveVerticalBool.value;
                    break;
            }
        });
        watch(() => characterStore.character, () => {
            comboStore.comboInputsDisplay = [];
        });

        const splitComboSections = () => {
            comboStore.clearNotationSegments();
            const notations = [...comboStore.notationsDisplay];
            const notationsArrayLength = notations.length;
            const nextNotationIndices = [];
            console.log(notations);


            for (let i = 0; i < notations.length; i++) {
                const notation = notations[i];
                notation.notation === '>' ? nextNotationIndices.push(i) : null;
            }
            
            let notationChunks = [];
            let k = 1;
            for (let j = 0; j <= nextNotationIndices.length; j++) {
                let start = 0;
                let index = 0;
                let chunk = null;

                if(k > 0) {
                    start = 0;
                } else {
                    start = nextNotationIndices[index];
                    index += 1;
                }

                chunk = notations.slice(
                    k > 0 ? start : nextNotationIndices[j - index], 
                    nextNotationIndices[j]
                ).filter(notation => notation.notation !== '>');

                notationChunks.push(chunk);
                k -= 1;
            }
            notationChunks.forEach(chunk => comboStore.addNotationSegments(chunk));
            console.log(comboStore.notationSegments);
        }

        const presentComboVertically = () => {
            splitComboSections();

            let inputComboDisplay = document.querySelector('#vertical-combo-display');
            inputComboDisplay?.requestFullscreen();
        }

        return {
            gameStore,
            comboStore,
            characterStore,
            comboInputs,
            enterFullScreen,
            fullScreenActiveHorizontalBool,
            fullScreenActiveVerticalBool,
            splitComboSections,
            presentComboVertically,
            getInput,
            getGameAbbreviation,
            getInputImgFilename
        }
    },
    props: {
        inputs: Array
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
    <div
        class="space-x-2 flex flex-row overflow-x-scroll pt-1 overflow-y-auto items-center h-20 bg-blue" 
        id="horizontal-combo-display"
    >
        <div
            v-for="comboInput in comboStore.comboInputsDisplay"
            :key="comboInput.id"
            class="shrink-0"
        >
            <AttackButton 
                v-if="comboInput.category === 'attack-buttons'" 
                :iconFileName="getInputImgFilename(comboInput.name)"
                :game="getGameAbbreviation()"
                :attack="comboInput"
                :class="{ 'h-96 w-96': fullScreenActiveHorizontalBool, 'h-12 w-12': !fullScreenActiveHorizontalBool}"

            />
            <DirectionalInput 
                v-else-if="comboInput.category === 'directional-inputs'" 
                :iconFileName="getInputImgFilename(comboInput.direction)"
                :game="getGameAbbreviation()"
                :direction="comboInput"
                :class="{ 'h-96 w-96': fullScreenActiveHorizontalBool, 'h-12 w-12': !fullScreenActiveHorizontalBool}"
            />
            <CharacterNotation 
                v-else-if="comboInput.notations_group === 'character'" 
                :notation="comboInput.notation"
                :class="{ 'h-96 w-96': fullScreenActiveHorizontalBool, 'h-12 w-12': !fullScreenActiveHorizontalBool}"
            />
            <GameNotation 
                v-else :notation="comboInput.notation"
                :class="{ 'text-9xl': fullScreenActiveHorizontalBool}"
                class="text-white p-2 h-10 w-10"
                :isFullScreen="fullScreenActiveHorizontalBool"

                :iconFileName="getInputImgFilename(comboInput.notation)"
            />
        </div>
    </div>
    <!-- Full screen display -->
    <div
        :class="{ 'hidden': fullScreenActiveVerticalBool === false, 'visible bg-red-500 overflow-x-auto overflow-y-auto': fullScreenActiveVerticalBool === true }" 
        id="vertical-combo-display"
    >
        <div class="flex flex-row items-center" v-for="segment in comboStore.notationSegments" :key="segment.id">
            <div class="shrink-0" v-for="notation in segment" @click="getInput(notation.notation, notation.category)">
                <AttackButton 
                    v-if="notation.category === 'attack-buttons'" 
                    :iconFileName="notation.icon_file_name"
                    :attack="notation"
                    :class="{ 'h-96 w-96': fullScreenActiveVerticalBool, 'h-12 w-12': !fullScreenActiveVerticalBool}"

                />
                <DirectionalInput 
                    v-else-if="notation.category === 'directional-inputs'" 
                    :iconFileName="notation.icon_file_name"
                    :direction="notation"
                    :class="{ 'h-96 w-96': fullScreenActiveVerticalBool, 'h-12 w-12': !fullScreenActiveVerticalBool}"
                />
                <CharacterNotation 
                    v-else-if="notation.notations_group === 'character'" :notation="notation.notation"
                    :class="{ 'h-96 w-96': fullScreenActiveVerticalBool, 'h-12 w-12': !fullScreenActiveVerticalBool}"
                />
                <GameNotation 
                    v-else :notation="notation.notation"
                    :class="{ 'text-9xl': fullScreenActiveVerticalBool}"
                    class="fill-green-400 p-2 border rounded"
                    :isFullScreen="fullScreenActiveVerticalBool"

                    :iconFileName="notation.icon_file_name"
                />

            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>