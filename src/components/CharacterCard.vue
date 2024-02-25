<script lang="ts">
import CharacterPortrait from './CharacterPortrait.vue';
import PushPinOff from './icons/PushPinOff.vue';
import PushPinOn from './icons/PushPinOn.vue';
import { isResourcePinned, pinResource, unPinResource, getPinnedResources } from '@/common/helpers';
import { useCharacterStore } from '@/stores/CharacterStore';
import { computed } from 'vue';


export default {
    setup(props) {
        const characterStore = useCharacterStore();
        const characterId = characterStore.characters.find(character => character.name === props.characterName)?.id;
        const pinnedCharacters = computed(() => characterStore.pinnedCharacters);
        
        const isCharacterPinned = computed(() => {
            return pinnedCharacters.value?.includes(characterId);
        });
        
        const handlePinCharacter = (event) => {
            console.log(isCharacterPinned);
            event.stopPropagation();
            
            if(isCharacterPinned.value === true) {
                unPinResource('characters', characterId);
                return;
            } else {
                pinResource('characters', characterId);
            }
        }

        return {
            isCharacterPinned,
            handlePinCharacter
        }

    },
    props: {
        game: String,
        characterName: String,
    },
    components: {
        CharacterPortrait,
        PushPinOff,
        PushPinOn
    }
}
</script>
<template lang="">
    <div class="p-2 flex flex-row w-full justify-between bg-white rounded space-x-2">
        <div class="flex flex-row items-center space-x-2">
            <div class="w-24 h-24">
                <CharacterPortrait :game="game" :characterName="characterName" />
            </div>
            <div class="text-xl">
                <p class="text-black uppercase text-2xl">{{ characterName === 'Bedman' ? 'Bedman?' : characterName }}</p>
            </div>
        </div>
        <div class="flex flex-row items-start" @click="handlePinCharacter($event)">
            <PushPinOn v-if="isCharacterPinned" class="h-6 w-6 text-black" />
            <PushPinOff v-else class="h-6 w-6 text-black" />
        </div>
    </div>
</template>
<style lang="">
    
</style>