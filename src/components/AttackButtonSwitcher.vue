<script lang="ts">
import AttackButtonSinglesGroup from './AttackButtonSinglesGroup.vue';
import AttackButtonDoublesGroup from './AttackButtonDoublesGroup.vue';
import AttackButtonTriplesGroup from './AttackButtonTriplesGroup.vue';
import { ref } from 'vue';
export default {
    setup() {
        const attackButtonGroupSelection = ref('singles');
        return {
            attackButtonGroupSelection
        }
    },
    components: {
        AttackButtonSinglesGroup,
        AttackButtonDoublesGroup,
        AttackButtonTriplesGroup,
    }    
}
</script>
<template lang="">
    <div class="flex flex-col">
       <div>
            <AttackButtonSinglesGroup v-if = "attackButtonGroupSelection === 'singles'" />
       </div> 
       <div>
            <AttackButtonDoublesGroup v-if = "attackButtonGroupSelection === 'doubles'" />
       </div>
       <div>
            <AttackButtonTriplesGroup v-if = "attackButtonGroupSelection === 'triples'" />
       </div>
       <div class="flex flex-row">
            <button class="border rounded p-2" @click="attackButtonGroupSelection = 'singles'">Singles</button>
            <button class="border rounded p-2" @click="attackButtonGroupSelection = 'doubles'">Doubles</button>
            <button class="border rounded p-2" @click="attackButtonGroupSelection = 'triples'">Triples</button>
        </div>
    </div>
</template>
<style lang="">
    
</style>