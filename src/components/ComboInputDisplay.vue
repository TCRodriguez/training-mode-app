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

export default {
    setup() {
        const comboStore = useComboStore();
        const characterStore = useCharacterStore();
        const gameStore = useGameStore();
        const comboDisplay = computed(() => comboStore.comboDisplay);
        const { getInput } = storeToRefs(gameStore);
        let fullScreenActiveHorizontalBool = ref(false);
        let fullScreenActiveVerticalBool = ref(false);
        const enterFullScreen = () => {
            let comboDisplay = document.querySelector('#horizontal-combo-display');
            comboDisplay?.requestFullscreen();
        };
        
        addEventListener('fullscreenchange', (event) => {
            console.log("Full screen exited.")
            // console.log(event);
            // console.log(document.fullscreenElement);
            // if(event.target.id === 'combo-display') {
            //     fullScreenActiveHorizontalBool.value = !fullScreenActiveHorizontalBool.value;
            // }
            console.log(event.target.id);
            switch (event.target.id) {
                case 'horizontal-combo-display':
                    fullScreenActiveHorizontalBool.value = !fullScreenActiveHorizontalBool.value;
                    break;
                case 'vertical-combo-display':
                    fullScreenActiveVerticalBool.value = !fullScreenActiveVerticalBool.value;
                    // console.log(fullScreenActiveVerticalBool.value);
                    // comboStore.notationSegments = [];
                    break;
            }
            console.log(fullScreenActiveVerticalBool.value);
        });
        addEventListener('click', (event) => {
            // console.log(event.target.innerText === 'Present combo vertically');
            // if(event.target )
            // if(event.target.innerText === 'Go Fullscreen') {
            //     fullScreenActiveHorizontalBool.value = !fullScreenActiveHorizontalBool.value
            // }
        })
        watch(() => characterStore.character, () => {
            console.log('character has changed');
            comboStore.comboDisplay = [];
        });

        const splitComboSections = () => {
            comboStore.clearNotationSegments();
            const notations = [...comboStore.notationsDisplay];
            const notationsArrayLength = notations.length;
            const nextNotationIndices = [];


            for (let i = 0; i < notations.length; i++) {
                const notation = notations[i];
                notation === '>' ? nextNotationIndices.push(i) : null;
            }
            // console.log(nextNotationIndices);
            // console.log(notationsArrayLength);
        

            // const nextNotationsIndicesLength = nextNotationIndices.length;
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
                ).filter(notation => notation !== '>');

                notationChunks.push(chunk);
                k -= 1;
            }
            notationChunks.forEach(chunk => comboStore.addNotationSegments(chunk));
        }

        const presentComboVertically = () => {
            splitComboSections();

            // fullScreenActiveVerticalBool.value = !fullScreenActiveVerticalBool.value;
            let comboDisplay = document.querySelector('#vertical-combo-display');
            comboDisplay?.requestFullscreen();
            // console.log(fullScreenActiveVerticalBool.value);
        }
        return {
            comboStore,
            characterStore,
            comboDisplay,
            enterFullScreen,
            fullScreenActiveHorizontalBool,
            fullScreenActiveVerticalBool,
            splitComboSections,
            presentComboVertically,
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
    <div
        class="border space-x-2 flex flex-row overflow-x-auto overflow-y-auto items-center" 
        id="horizontal-combo-display"
    >
        <div
            v-for="comboInput in comboDisplay"
            :key="comboInput.id"
            class="shrink-0"
        >
            <AttackButton 
                v-if="comboInput.category === 'attack-buttons'" :iconFileName="comboInput.icon_file_name"
                :class="{ 'h-96 w-96': fullScreenActiveHorizontalBool, 'h-12 w-12': !fullScreenActiveHorizontalBool}"

            />
            <DirectionalInput 
                v-else-if="comboInput.category === 'directional-inputs'" :iconFileName="comboInput.icons[0].icon_file_name"
                :class="{ 'h-96 w-96': fullScreenActiveHorizontalBool, 'h-12 w-12': !fullScreenActiveHorizontalBool}"
            />
            <CharacterNotation 
                v-else-if="comboInput.notations_group === 'character'" :notation="comboInput.notation"
                :class="{ 'h-96 w-96': fullScreenActiveHorizontalBool, 'h-12 w-12': !fullScreenActiveHorizontalBool}"
            />
            <GameNotation 
                v-else :notation="comboInput.notation"
                :class="{ 'text-9xl': fullScreenActiveHorizontalBool}"
                class="fill-green-400 p-2 h-10 w-10"
                :isFullScreen="fullScreenActiveHorizontalBool"

                :iconFileName="comboInput.icon_file_name"
            />
        </div>
    </div>
    <div
        :class="{ 'hidden': fullScreenActiveVerticalBool === false, 'visible bg-red-500 overflow-x-auto overflow-y-auto': fullScreenActiveVerticalBool === true }" 
        id="vertical-combo-display"
    >
        <div class="flex flex-row items-center" v-for="segment in comboStore.notationSegments" :key="segment.id">
            <div class="shrink-0" v-for="notation in segment">
                <!-- {{comboStore.comboDisplay[]}} -->
                <!-- <p>{{notation.notation}}</p> -->
                <!-- <p>{{notation.notation}}</p> -->
                <!-- <p>{{notation.category}}</p> -->
                
                <!-- <img :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/${notation.category}%2Ftekken-7%2F${notation.icon}`" alt=""> -->
                <AttackButton 
                    v-if="notation.category === 'attack-buttons'" :iconFileName="notation.icon_file_name"
                    :class="{ 'h-96 w-96': fullScreenActiveVerticalBool, 'h-12 w-12': !fullScreenActiveVerticalBool}"

                />
                <DirectionalInput 
                    v-else-if="notation.category === 'directional-inputs'" :iconFileName="notation.icon_file_name"
                    :class="{ 'h-96 w-96': fullScreenActiveVerticalBool, 'h-12 w-12': !fullScreenActiveVerticalBool}"
                />
                <CharacterNotation 
                    v-else-if="notation.notations_group === 'character'" :notation="notation.notation"
                    :class="{ 'h-96 w-96': fullScreenActiveVerticalBool, 'h-12 w-12': !fullScreenActiveVerticalBool}"
                />
                <GameNotation 
                    v-else :notation="notation.notation"
                    :class="{ 'text-9xl': fullScreenActiveVerticalBool}"
                    class="fill-green-400 p-2 h-10 w-10"
                    :isFullScreen="fullScreenActiveVerticalBool"

                    :iconFileName="notation.icon_file_name"
                />
            </div>
        </div>
    </div>
    <div class="flex flex-row justify-center space-x-5">
        <button class="bg-yellow-500" @click="comboStore.eraseComboInput">Erase</button>
        <button class="bg-red-500" @click="comboStore.clearComboDisplay">Clear</button>
        <button class="bg-green-500" @click="enterFullScreen()">Go Fullscreen</button>
        <button class="bg-green-500" @click="splitComboSections()">Split combo sections</button>
        <button class="bg-cyan-500" @click="presentComboVertically()">Present combo vertically</button>
    </div>
</template>
<style lang="">
    
</style>