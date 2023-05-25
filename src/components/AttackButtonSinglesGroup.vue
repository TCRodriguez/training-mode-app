<script lang="ts">
import { useGameStore } from '@/stores/GameStore';
import { useComboStore } from '@/stores/ComboStore';
import { toRaw, ref, computed } from 'vue';
import AttackButton from './AttackButton.vue';
export default {
    // props: {
    //     buttons: Array
    // },
    setup(props) {
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        // const attackButtons = ref(props.buttons);
        // const displayAccountCreationSuccess = computed(() => store.state.login.newTrainerCreated);
        const attackButtonSingles = gameStore.getAttackButtonSingles;
        const renderAttackInput = (input: object) => {
            comboStore.addAttackButtonInputToDisplay(input)
        }
        return {
            gameStore,
            comboStore,
            attackButtonSingles,
            renderAttackInput
        }
        
    },
    components: {
        AttackButton
    }
}
</script>
<template lang="">
    <div class="grid grid-rows-2 grid-cols-2">
        <div
            v-for="attackButton in gameStore.getAttackButtonSingles"
            :key="attackButton.id"
            @click="renderAttackInput(attackButton)"
        >
            <AttackButton :iconFileName="attackButton.icon_file_name" :game="gameStore.game.abbreviation" class="h-20 w-20" />
        </div>
    </div>
</template>
<style lang="">
    
</style>