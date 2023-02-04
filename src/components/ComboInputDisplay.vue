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
            fullScreenActiveBool.value = true;
        };

        return {
            comboStore,
            comboDisplay,
            enterFullScreen,
            fullScreenActiveBool
        }
    }
}
</script>
<template lang="">
    <div>
        <div class="border space-x-5" id="combo-display">
            <span v-for="comboInput in comboDisplay" :key="comboInput.id" :class="{ 'text-xl': fullScreenActiveBool }">{{ comboInput }}</span>
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