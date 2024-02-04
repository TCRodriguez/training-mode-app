<script lang="ts">
import DirectionalInputGroup from './DirectionalInputGroup.vue';
import DirectionalInputHoldGroup from './DirectionalInputHoldGroup.vue';
import DirectionalInputCanned from './DirectionalInputCanned.vue';
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
        DirectionalInputCanned
    }        
}
</script>
<template lang="">
    <div class="flex flex-col" :class="{'xs:w-1/2 w-1/2' : directionalInputGroupSelection === 'group'}">
        <div 
            class="flex flex-row text-yellow space-x-2" 
            :class="{
                'justify-end' : directionalInputGroupSelection === 'group', 
                'justify-center': directionalInputGroupSelection === 'tap' || directionalInputGroupSelection === 'hold'
            }"
        >
            <button class="p-2" :class="{'border rounded': directionalInputGroupSelection === 'tap'}" @click="directionalInputGroupSelection = 'tap'">Tap</button>
            <button class="p-2" :class="{'border rounded': directionalInputGroupSelection === 'hold'}" @click="directionalInputGroupSelection = 'hold'">Hold</button>
            <button class="p-2" :class="{'border rounded': directionalInputGroupSelection === 'group'}" @click="directionalInputGroupSelection = 'group'">Group</button>
        </div>
        <div>

            <div v-if="directionalInputGroupSelection === 'tap'">
                <DirectionalInputGroup />
            </div>
            <div v-if="directionalInputGroupSelection === 'hold'">
                <DirectionalInputHoldGroup />
            </div>
            <div v-if="directionalInputGroupSelection === 'group'" class="overflow-y-auto h-[10rem] xs:h-[10rem] lg:h-[13rem]">
                <DirectionalInputCanned  />
            </div>
        </div>

    </div>
</template>
<style lang="">
    
</style>