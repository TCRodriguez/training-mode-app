<script lang="ts">
import { useComboStore } from '@/stores/ComboStore';
import { useGameStore } from '@/stores/GameStore';
import { computed } from 'vue';
export default {
    props: {
        directions: String,
        directionalInputId: String
    },
    setup() {
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        const directions = computed(() => gameStore.directionalInputs);
        // const directions = [
        //     {
        //         direction: 'Up Back',
        //         svgLink: 'https://dl.dropbox.com/s/bi62o50yu4tmcd4/ub.svg'
        //     },
        //     {

        //     }
        //     ,
        //     'Up',
        //     'Up Forward',
        //     'Back',
        //     'Neutral',
        //     'Forward',
        //     'Down Back',
        //     'Down',
        //     'Down Forward'
        // ]

        const renderComboInput = (input: string) => {
            comboStore.addComboInputToDisplay(input)
        }

        return {
            gameStore,
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
        <img
            v-for="direction in directions" 
            :key="direction.id"
            @click="renderComboInput(direction)"
            height="150"
            width="150"
            :alt="direction.direction"
            :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/directional-inputs%2F${direction.icon_file_name}`"
        >
        <!-- <img src="https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/arrows%2Fb.svg" alt=""> -->
        
    </div>
</template>
<style lang="">
    
</style>