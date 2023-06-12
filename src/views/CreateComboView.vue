<script lang="ts">
import { useGameStore } from '../stores/GameStore';
import { useCharacterStore } from '../stores/CharacterStore';
import { useRouter, useRoute } from 'vue-router';
import DirectionalInputGroup from '@/components/DirectionalInputGroup.vue';
import DirectionalInputHoldGroup from '@/components/DirectionalInputHoldGroup.vue';
import DirectionalInputSwitcher from '@/components/DirectionalInputSwitcher.vue';
import AttackButtonSwitcher from '@/components/AttackButtonSwitcher.vue';
import ComboInputDisplay from '@/components/ComboInputDisplay.vue';
import CharacterComboInputGroup from '@/components/CharacterComboInputGroup.vue';
import GameNotationGroup from '@/components/GameNotationGroup.vue';
import CharacterList from '@/components/CharacterList.vue';
import { reactive, toRaw } from 'vue';

export default {
    setup() {
        const gameStore = useGameStore();
        const characterStore = useCharacterStore();
        const router = useRouter();
        const route = useRoute();
        const buttons = reactive(toRaw(gameStore.attackButtons));

        return {
            gameStore,
            characterStore,
            router,
            route,
            buttons,
        }
    },
    created() {
        this.characterStore.fetchCharacters(this.route.params.game);
        this.gameStore.fetchGameNotations(this.route.params.game);
        this.gameStore.fetchDirectionalInputs();
        this.gameStore.fetchAttackButtons(this.route.params.game)
            .then(() => {
                this.buttons = JSON.parse(JSON.stringify(this.gameStore.attackButtons))
            });
    },
    components: {
        DirectionalInputGroup,
        DirectionalInputHoldGroup,
        DirectionalInputSwitcher,
        AttackButtonSwitcher,
        CharacterComboInputGroup,
        ComboInputDisplay,
        GameNotationGroup,
        CharacterList
    }
}
</script>
<template lang="">
    <section>
        <div>
            <CharacterList />
        </div>
        <div>
            <ComboInputDisplay />
        </div>
        <div class="flex flex-row justify-center items-center">
                <DirectionalInputSwitcher />
                <AttackButtonSwitcher />
                <CharacterComboInputGroup />
                <GameNotationGroup />
        </div>
    </section>
</template>
<style lang="">
    
</style>