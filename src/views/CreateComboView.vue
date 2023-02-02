<script lang="ts">
import { useGameStore } from '../stores/GameStore';
import { useCharacterStore } from '../stores/CharacterStore';
import { useRouter, useRoute } from 'vue-router';
import DirectionalInput from '@/components/DirectionalInput.vue';
import AttackButtonGroup from '@/components/AttackButtonGroup.vue';
import ComboInputDisplay from '@/components/ComboInputDisplay.vue';
import { ref, reactive, toRaw } from 'vue';

export default {
    setup() {
        const gameStore = useGameStore();
        const characterStore = useCharacterStore();
        const router = useRouter();
        const route = useRoute();
        const buttons = reactive(toRaw(gameStore.attackButtons));

        // const addComboInput = (comboInput) => {
            
        // }

        return {
            gameStore,
            characterStore,
            router,
            route,
            buttons
        }
    },
    created() {
        this.gameStore.fetchDirectionalInputs();
        this.gameStore.fetchAttackButtons(this.route.params.game)
            .then(() => {
                // this.buttons = toRaw(this.gameStore.attackButtons)
                // console.log(toRaw(this.gameStore.getAttackButtons));
                // console.log(this.buttons);
                // console.log(JSON.parse(JSON.stringify(this.gameStore.attackButtons)));
                this.buttons = JSON.parse(JSON.stringify(this.gameStore.attackButtons))
                console.log(this.buttons);
            });
        // console.log(this.gameStore.getAttackButtons);
        // console.log(this.buttons);

    },
    components: {
        DirectionalInput,
        AttackButtonGroup,
        ComboInputDisplay
    }
}
</script>
<template lang="">

    <section>
        <h2>Input a combo for {{characterStore.character.name}}</h2>
        <div>
            <ComboInputDisplay />
        </div>
        <div class="flex flex-row justify-center">
            <!-- <div class="border">
                
            </div> -->
            <!-- <div class="bg-blue-500"> -->
                <!-- <ul>
                    <li
                        v-for="directionalInput in gameStore.directionalInputs"
                        :key="directionalInput.id"
                        @click="addComboInput(directionalInput.direction)"
                    ><DirectionalInput :direction="directionalInput.direction" /></li>
                </ul> -->
                <DirectionalInput :directions="gameStore.directionalInputs" />
            <!-- </div> -->
            <!-- <div class=""> -->
                <!-- <ul>
                    <li
                        v-for="attackButton in gameStore.attackButtons"
                        :key="attackButton.id"
                    >{{ attackButton.name }}</li>
                </ul> -->
                <AttackButtonGroup :buttons="buttons" />
            <!-- </div> -->
        </div>
    </section>
</template>
<style lang="">
    
</style>