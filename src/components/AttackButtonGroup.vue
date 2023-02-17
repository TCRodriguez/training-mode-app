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
        const attackButtons = computed(() => gameStore.attackButtons);
        const renderComboInput = (input: string) => {
            comboStore.addComboInputToDisplay(input)
        }
        return {
            gameStore,
            comboStore,
            attackButtons,
            renderComboInput
        }
        
    },
    components: {
        AttackButton
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
        <!-- <img 
            v-for="attackButton in attackButtons"
            :key="attackButton.id"
            @click="renderComboInput(attackButton)"
            height="75"
            width="75"
            :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/attack-buttons%2F${attackButton.icon_file_name}`"
            :alt="attackButton.name"
        > -->
        <!-- <img src="" alt="" srcset=""> -->
        <div
            v-for="attackButton in attackButtons"
            :key="attackButton.id"
            @click="renderComboInput(attackButton)"
        >
            <AttackButton :iconFileName="attackButton.icon_file_name" class="h-20 w-20" />
        </div>
    </div>
</template>
<style lang="">
    
</style>