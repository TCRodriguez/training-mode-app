<script lang="ts">
import { useGameStore } from '../stores/GameStore';
import { useCharacterStore } from '../stores/CharacterStore';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import DirectionalInputGroup from '@/components/DirectionalInputGroup.vue';
import DirectionalInputHoldGroup from '@/components/DirectionalInputHoldGroup.vue';
import AttackButtonGroup from '@/components/AttackButtonGroup.vue';
import ComboInputDisplay from '@/components/ComboInputDisplay.vue';
import CharacterComboInputGroup from '@/components/CharacterComboInputGroup.vue';
import GameNotationGroup from '@/components/GameNotationGroup.vue';
import CharacterList from '@/components/CharacterList.vue';
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
            buttons,
        }
    },
    created() {
        this.characterStore.fetchCharacters(this.route.params.game);
        this.gameStore.fetchNotations(this.route.params.game);
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
        // if(Object.keys(this.characterStore.character).length === 0) {
        //     this.characterStore.fetchCharacters(this.route.params.game);
        //     this.characterStore.setCharacter(this.route.params.character);
        // }
        // console.log(this.route.params.character);
        // console.log(this.gameStore.getAttackButtons);
        // console.log(this.buttons);
        // window.addEventListener('beforeunload', () => {
        //     console.log("test");
        //     this.router.push(`/combo-viewer`)
        // })
        // window.addEventListener('beforeunload', function(event) {
        //     // event.returnValue = 'Write something'
        //     this.window.location.href = "https://www.youtube.com"
        // })
        // window.onbeforeunload = () => {
        //     console.log("tessadfdsafasd");
        //     this.router.replace('/combo-viewer')
        // }
        

    },
    // beforeUnmount() {
    //     console.log("test");
    // },
    // unmounted() {
    //     console.log("unmounted");
    //     this.router.push('/combo-viewer')
    // },
    // beforeRouteLeave (to, from, next) {
    //     alert('test')
    // },
    components: {
        DirectionalInputGroup,
        DirectionalInputHoldGroup,
        AttackButtonGroup,
        CharacterComboInputGroup,
        ComboInputDisplay,
        GameNotationGroup,
        CharacterList
    }
}
</script>
<template lang="">
    <section>
        <!-- <h2>Input a combo for {{characterStore.character.name}}</h2> -->
        <!-- 
            * Hide this CharacterList component while there is no value in the
            * charcter search input.
         -->
        <div>
            <CharacterList />
        </div>
        <div>
            <ComboInputDisplay />
        </div>
        <div class="flex flex-row justify-center">
                <DirectionalInputGroup />
                <DirectionalInputHoldGroup />
                <AttackButtonGroup />
                <CharacterComboInputGroup />
                <GameNotationGroup />
        </div>
    </section>
</template>
<style lang="">
    
</style>