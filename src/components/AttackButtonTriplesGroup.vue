<script lang="ts">
import AttackButton from './AttackButton.vue';
import { useGameStore } from '@/stores/GameStore';
import { useComboStore } from '@/stores/ComboStore';

export default {
    setup(props) {
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        // const attackButtons = ref(props.buttons);
        // const displayAccountCreationSuccess = computed(() => store.state.login.newTrainerCreated);
        const renderAttackInput = (input: object) => {
            comboStore.addAttackButtonInputToDisplay(input)
        }
        return {
            gameStore,
            comboStore,
            renderAttackInput
        }
        
    },
    components: {
        AttackButton
    }
}
</script>
<template lang="">
    <div class="grid grid-rows-2 grid-cols-2 h-full bg-red">
        <div
            v-for="attackButton in gameStore.getAttackButtonTriples"
            :key="attackButton.id"
            @click="renderAttackInput(attackButton)"
        >
            <AttackButton :iconFileName="attackButton.icon_file_name" class="h-20 w-20" />
        </div>
    </div>
</template>
<style lang="">
    
</style>