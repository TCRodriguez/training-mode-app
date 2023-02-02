<script lang="ts">
import { useGameStore } from '@/stores/GameStore';
import { useComboStore } from '@/stores/ComboStore';
import { toRaw, ref, computed } from 'vue';
export default {
    props: {
        buttons: Array
    },
    setup(props) {
        // console.log(JSON.parse(JSON.stringify(props)));
        console.log(props.buttons);
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        // const attackButtons = ref(props.buttons);
        // const displayAccountCreationSuccess = computed(() => store.state.login.newTrainerCreated);
        const attackButtons = computed(() => gameStore.attackButtons);
        const renderComboInput = (input: string) => {
            console.log(input);
            comboStore.addComboInputToDisplay(input)
        }
        return {
            gameStore,
            comboStore,
            attackButtons,
            renderComboInput
        }
        
    }
}
</script>
<template lang="">
    <div class="grid grid-rows-2 grid-cols-2 h-full bg-red-500">
        <!-- <ul>
            <li
                v-for="attackButton in attackButtons"
                :key="attackButton.id"
            >{{ attackButton.name }}</li>
        </ul> -->
        <span 
            v-for="attackButton in attackButtons"
            :key="attackButton.id"
            @click="renderComboInput(attackButton.name)"
        
        >{{attackButton.name}}</span>
    </div>
</template>
<style lang="">
    
</style>