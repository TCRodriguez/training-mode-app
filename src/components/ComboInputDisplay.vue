<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
import { computed } from 'vue';

export default {
    setup() {
        const comboStore = useComboStore();
        const comboDisplay = computed(() => comboStore.comboDisplay);

        return {
            comboStore,
            comboDisplay,
        }
    }
}
</script>
<template lang="">
    <div>
        <div class="border space-x-5">
            <span v-for="comboInput in comboDisplay" :key="comboInput.id">{{ comboInput }}</span>
        </div>
        <div class="flex flex-row justify-center space-x-5">
            <button class="bg-yellow-500" @click="comboStore.eraseComboInput">Erase</button>
            <button class="bg-red-500" @click="comboStore.clearComboDisplay">Clear</button>
        </div>
    </div>
</template>
<style lang="">
    
</style>