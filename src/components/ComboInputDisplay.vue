<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
import { computed, ref } from 'vue';

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
            setTimeout(() => {
                let n = 0;
                while(n < comboDisplay?.scrollWidth){
                    comboDisplay?.scrollBy({
                        left: 100,
                        behavior: 'smooth'
                    })
                    n += 10;
                    console.log(n);
                }
            }, 3000);
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
    }
}
</script>
<template lang="">
    <div>
        <div class="border space-x-5 flex flex-row overflow-x-auto items-center " id="combo-display">
            <!-- <span 
                v-for="comboInput in comboDisplay"
                :key="comboInput.id"
                :class="{ 'text-red-500': fullScreenActiveBool }"
            >{{ comboInput }}</span> -->
            <!-- <button @click="toggleAutoScroll()">Test</button> -->
            <img
                v-for="comboInput in comboDisplay"
                :key="comboInput.id"
                :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/${comboInput.category}%2F${comboInput.icon_file_name}`"
                class="h-12 w-12"
                :class="{ 'h-96 w-96': fullScreenActiveBool}"

            >
        </div>
        <div class="flex flex-row justify-center space-x-5">
            <button class="bg-yellow-500" @click="comboStore.eraseComboInput">Erase</button>
            <button class="bg-red-500" @click="comboStore.clearComboDisplay">Clear</button>
            <button class="bg-green-500" @click="enterFullScreen()">Go Fullscreen</button>
        </div>
    </div>
</template>
<style lang="">
    
</style>