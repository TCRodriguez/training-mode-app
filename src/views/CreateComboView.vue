<script lang="ts">
import { useGameStore } from '../stores/GameStore';
import { useCharacterStore } from '../stores/CharacterStore';
import { useRouter, useRoute } from 'vue-router';
export default {
    setup() {
        const gameStore = useGameStore();
        const characterStore = useCharacterStore();
        const router = useRouter();
        const route = useRoute();

        return {
            gameStore,
            characterStore,
            router,
            route
        }
    },
    created() {
        this.gameStore.fetchDirectionalInputs();
        this.gameStore.fetchAttackButtons(this.route.params.game);
    }
}
</script>
<template lang="">
    <div>
        <p>Input a combo for {{ characterStore.character.name }}</p>
        <div>
            <ul>
                <li
                    v-for="directionalInput in gameStore.directionalInputs"
                    :key="directionalInput.id" 
                >{{ directionalInput.direction }}</li>
            </ul>
        </div>
        <div>
            <ul>
                <li
                    v-for="attackButton in gameStore.attackButtons"
                    :key="attackButton.id"
                >{{ attackButton.name }}</li>
            </ul>
        </div>
    </div>
</template>
<style lang="">
    
</style>