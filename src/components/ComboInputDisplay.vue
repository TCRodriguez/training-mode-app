<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
import { computed, ref } from 'vue';
import AttackButton from '@/components/AttackButton.vue';
import DirectionalInput from './DirectionalInput.vue';
import CharacterNotation from './CharacterNotation.vue';

export default {
    setup() {
        const comboStore = useComboStore();
        const comboDisplay = computed(() => comboStore.comboDisplay);
        let fullScreenActiveBool = ref(false);
        const enterFullScreen = () => {
            let comboDisplay = document.querySelector('#combo-display');
            comboDisplay?.requestFullscreen();
            // comboDisplay?.scrollBy({
            //     left: comboDisplay.
                
            // });
            // setTimeout(() => {
            //     let n = 0;
            //     // while(n < comboDisplay?.scrollWidth){
            //         comboDisplay?.scrollBy({
            //             left: 100,
            //             behavior: 'smooth'
            //         })
            //         n += 10;
            //         console.log(n);
            //     // }
            // }, 3000);
            // comboDisplay.scrollLeft = comboDisplay.scrollWidth;


        };
        // const toggleAutoScroll = () => {
        //     console.log("Auto scroll button pressed.");
        //     window.scrollBy({
        //         top: 0,
        //         left: 500,
        //         behavior: 'smooth'
        //     })
        // }
        addEventListener('fullscreenchange', (event) => {
            console.log("Full screen exited.")
            fullScreenActiveBool.value = !fullScreenActiveBool.value;
        })

        return {
            comboStore,
            comboDisplay,
            enterFullScreen,
            fullScreenActiveBool,
            // toggleAutoScroll
        }
    },
    components: {
        AttackButton,
        DirectionalInput,
        CharacterNotation
    }
}
</script>
<template lang="">
    <div class="border space-x-5 flex flex-row overflow-x-auto items-center" id="combo-display">
        <!-- <span 
            v-for="comboInput in comboDisplay"
            :key="comboInput.id"
            :class="{ 'text-red-500': fullScreenActiveBool }"
        >{{ comboInput }}</span> -->
        <!-- <button @click="toggleAutoScroll()">Test</button> -->
        <!-- <img
            v-for="comboInput in comboDisplay"
            :key="comboInput.id"
            :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/${comboInput.category}%2F${comboInput.icon_file_name}`"
            class="h-12 w-12"
            :class="{ 'h-96 w-96': fullScreenActiveBool}"

        > -->
        <div
            v-for="comboInput in comboDisplay"
            :key="comboInput.id"
            class="shrink-0"
        >
            <AttackButton 
                v-if="comboInput.category === 'attack-buttons'" :iconFileName="comboInput.icon_file_name"
                :class="{ 'h-96 w-96': fullScreenActiveBool}"
            />
            <DirectionalInput 
                v-else-if="comboInput.category === 'directional-inputs'" :iconFileName="comboInput.icon_file_name"
                :class="{ 'h-96 w-96': fullScreenActiveBool}"
            />
            <CharacterNotation 
                v-else :notation="comboInput.notation"
                :class="{ 'text-9xl': fullScreenActiveBool}"
            />
        </div>

        
            <!-- * May add the <component> tag here to replace the <img> above -->
    </div>
    <div class="flex flex-row justify-center space-x-5">
        <button class="bg-yellow-500" @click="comboStore.eraseComboInput">Erase</button>
        <button class="bg-red-500" @click="comboStore.clearComboDisplay">Clear</button>
        <button class="bg-green-500" @click="enterFullScreen()">Go Fullscreen</button>
    </div>
</template>
<style lang="">
    
</style>