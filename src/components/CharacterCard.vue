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
    <div class="p-2 flex flex-row w-full items-center space-x-2">
        <div class="w-24 h-24">
            <CharacterPortrait :game="game" :characterName="characterName" />
        </div>
        <div class="text-xl">
            <p>{{ characterName }}</p>
        </div>
    </div>
</template>
<style lang="">
    
</style>