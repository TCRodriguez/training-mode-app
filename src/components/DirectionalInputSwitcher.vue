<script lang="ts">
import DirectionalInputGroup from './DirectionalInputGroup.vue';
import DirectionalInputHoldGroup from './DirectionalInputHoldGroup.vue';
import { ref } from 'vue';
export default {
    setup() {
        const directionalInputGroupSelection = ref('tap');
        return {
            directionalInputGroupSelection
        }
    },
    components: {
        DirectionalInputGroup,
        DirectionalInputHoldGroup,
    }        
}
</script>
<template lang="">
    <div class="flex flex-col ">
        <div class="flex flex-row text-yellow justify-center space-x-2">
            <button class="border rounded p-2" @click="directionalInputGroupSelection = 'tap'">Tap</button>
            <button class="border rounded p-2" @click="directionalInputGroupSelection = 'hold'">Hold</button>
        </div>
        <div>
            <DirectionalInputGroup v-if="directionalInputGroupSelection === 'tap'" />
        </div>
        <div>
            <DirectionalInputHoldGroup v-if="directionalInputGroupSelection === 'hold'" />
        </div>

    </div>
</template>
<style lang="">
    
</style>