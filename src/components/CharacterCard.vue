<script lang="ts">
import CharacterPortrait from './CharacterPortrait.vue';
export default {
    props: {
        game: String,
        characterName: String,
    },
    components: {
        CharacterPortrait
    }
}
</script>
<template lang="">
    <div class="p-2 flex flex-row w-full items-center bg-white rounded space-x-2">
        <div class="w-24 h-24">
            <CharacterPortrait :game="game" :characterName="characterName" />
        </div>
        <div class="text-xl">
            <p class="text-black uppercase text-2xl">{{ characterName }}</p>
        </div>
    </div>
</template>
<style lang="">
    
</style>