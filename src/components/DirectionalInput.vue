<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
export default {
    props: {
        directions: String,
        directionalInputId: String
    },
    setup() {
        const comboStore = useComboStore();
        const directions = [
            'Up Back',
            'Up',
            'Up Forward',
            'Back',
            'Neutral',
            'Forward',
            'Down Back',
            'Down',
            'Down Forward'
        ]

        const renderComboInput = (input: string) => {
            console.log(input);
            comboStore.addComboInputToDisplay(input)
        }

        return {
            comboStore,
            directions,
            renderComboInput
        }
    }
    
}
</script>
<template lang="">
    <!-- <div>
        <p>{{direction}}</p>
    </div> -->
    <div class="grid grid-rows-3 grid-cols-3 bg-blue-500">
        <!-- <p v-for="direction in directions" :key="direction.id">{{direction.direction}}</p> -->
        <!-- ! Add background image of joystick/direction input to this div -->
        <!-- ! Overlay this grid onto it -->
        <!-- <p>Up Back</p>
        <p>Up</p>
        <p>Up Forward</p>
        <p>Back</p>
        <p>Neutral</p>
        <p>Forward</p>
        <p>Down Back</p>
        <p>Down</p>
        <p>Down Forward</p> -->
        <p
            v-for="direction in directions" 
            :key="direction.id"
            @click="renderComboInput(direction)"
        >{{direction}}</p>
    </div>
</template>
<style lang="">
    
</style>