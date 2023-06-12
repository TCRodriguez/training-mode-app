<script lang="ts">
import { useGameStore } from '@/stores/GameStore';
import { useCharacterStore } from '@/stores/CharacterStore';
export default {
    setup() {
        const gameStore = useGameStore();
        const characterStore = useCharacterStore();


        return {
            gameStore,
            characterStore
        }
    },
    props: {
        game: String,
        characterName: String
    }

}
</script>
<template lang="">
    <div class="flex flex-row justify-center mb-4 h-24 items-center space-x-4 bg-black overflow-hidden relative">
        <img :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/character-art%2F${gameStore.game.abbreviation}%2F${gameStore.game.abbreviation}-${characterStore.character.name}.png`" alt="" srcset="" class="absolute opacity-[.35] w-max h-auto left-0 -bottom-32 lg:left-32">
        <div class="relative">
            <h3 class="text-5xl font-bold text-white">{{ characterStore.character.name }}</h3>
        </div>
    </div>
</template>
<style lang="">
    
</style>