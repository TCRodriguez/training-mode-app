<script lang="ts">
import DirectionalInput from './DirectionalInput.vue';
import AttackButton from './AttackButton.vue';
import GameNotation from './GameNotation.vue';
import AddIconOutline from './icons/AddIconOutline.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useGameStore } from '@/stores/GameStore';
import { useCharacterMoveStore } from '../stores/CharacterMoveStore';
import CloseIcon from './icons/CloseIcon.vue';
import { storeToRefs } from 'pinia';

import { ref } from 'vue';
export default {
    setup(props) {
        const authStore = useAuthStore();
        const gameStore = useGameStore();
        const characterMoveStore = useCharacterMoveStore();
        const addTagInput = ref(null);
        const removedTagIds = ref([]);

        const { getCharacterMoveTags } = storeToRefs(characterMoveStore);

        return {
            authStore,
            gameStore,
            characterMoveStore,
            getCharacterMoveTags,
            addTagInput,
            removedTagIds
        }
    },
    props: {
        moveName: String,
        moveType: String,
        moveId: Number,
        inputs: Array,
        tags: Array,
        addTagInputActive: Boolean,
        editTagsActive: Array,
    },
    components: {
        DirectionalInput,
        AttackButton,
        AddIconOutline,
        CloseIcon,
        GameNotation
    }
}
</script>
<template lang="">
    <div>
        <div class="flex flex-row justify-between items-center">
            <p class="font-bold">
                {{ moveName }}
            </p>
            <p class="text-xs">
                {{ moveType }}
            </p>
        </div>
        <div class="flex flex-row overflow-x-auto">
            <div v-for="(input, index) in inputs" :key="index" class="flex flex-col mt-2 shrink-0">
                <DirectionalInput 
                    v-if="input.img_category === 'directional-inputs'" 
                    :iconFileName="input.icon_file_name"
                    :game="gameStore.game.abbreviation"
                    class="h-12 w-12"
                />               

                <AttackButton 
                    v-if="input.img_category === 'attack-buttons'" 
                    :iconFileName="input.icon_file_name"
                    :game="gameStore.game.abbreviation"
                    class="h-12 w-12"
                />
                <GameNotation
                    v-if="input.img_category === 'notations'"
                    class="h-12 w-12"
                    :notation="input.notation"
                
                />
            </div>
        </div>
        <div v-if="authStore.loggedInUser !== null" >
            <p class="font-bold">Tags</p>
            <div class="flex flex-row space-x-2 items-center flex-wrap">
                <div
                    v-for="(tag, index) in getCharacterMoveTags(moveId)" 
                    :key="index" 
                    class="flex flex-row items-center"
                    :class=" {'p-1 rounded': editTagsActive.includes(moveId)}"
                >
                    <div class="flex flex-row">
                        <div>
                            <span>#{{tag.name}}</span>
                        </div>
                        <CloseIcon v-if="editTagsActive.includes(moveId)" class="h-6 w-6" @click="$emit('triggerRemoveTag', tag.id, moveId)" />
                    </div>
                </div>
                <div class="">
                    <input 
                        v-if="editTagsActive.includes(moveId)"
                        ref="addTagInput"
                        @keyup.enter="$emit('saveTag', addTagInput.value, moveId), addTagInput.value = ''"
                        type="text" 
                        placeholder="Enter Tag..."
                        class="border w-min"
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>