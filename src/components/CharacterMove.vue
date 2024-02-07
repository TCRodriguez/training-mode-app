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
import { getInputImgFilename, getGameAbbreviation} from '@/common/helpers';
import { NSpace, NSpin } from 'naive-ui';

import { ref, watch, computed } from 'vue';
export default {
    setup(props) {
        const authStore = useAuthStore();
        const gameStore = useGameStore();
        const characterMoveStore = useCharacterMoveStore();
        const addTagInput = ref(null);
        const removedTagIds = ref([]);

        const { getCharacterMoveTags } = storeToRefs(characterMoveStore);
        const newTagLoading = computed(() => characterMoveStore.newCharacterMoveTagLoading);

        const handleAddTag = () => {
            characterMoveStore.updateNewCharacterMoveTagLoadingState();
        }

        return {
            authStore,
            gameStore,
            characterMoveStore,
            getCharacterMoveTags,
            addTagInput,
            removedTagIds,
            getGameAbbreviation,
            getInputImgFilename,
            newTagLoading,
            handleAddTag
        }
    },
    props: {
        moveName: String,
        moveType: String,
        moveId: Number,
        inputs: Array,
        tags: Array,
        addTagInputActive: Boolean,
        editTagsActive: {
            type: Array,
            default: () => []   
        }
    },
    components: {
        DirectionalInput,
        AttackButton,
        AddIconOutline,
        CloseIcon,
        GameNotation,
        NSpace,
        NSpin
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
        <div class="flex flex-row overflow-x-auto w-[20.5rem] xs:w-[22.5rem] w-[20rem] md:w-[61.75rem] lg:w-[67rem]">
            <div v-for="(input, index) in inputs" :key="index" class="flex flex-col mt-2 shrink-0">
                <DirectionalInput 
                    v-if="input.img_category === 'directional-inputs'" 
                    :iconFileName="getInputImgFilename(input.direction)"
                    :direction="input"
                    :game="getGameAbbreviation()"
                    class="h-12 w-12"
                />               
                <AttackButton 
                    v-if="input.img_category === 'attack-buttons'" 
                    :iconFileName="getInputImgFilename(input.name)"
                    :game="getGameAbbreviation()"
                    :attack="input"
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
                <div v-if="newTagLoading && editTagsActive.includes(moveId) " class="pr-2">
                    <n-space>
                        <n-spin size="small" stroke="#E6C900" />
                    </n-space>
                </div>
                <div class="">
                    <input 
                        v-if="editTagsActive.includes(moveId)"
                        ref="addTagInput"
                        @keyup.enter="handleAddTag(), $emit('saveTag', addTagInput.value, moveId), addTagInput.value = ''"
                        type="text" 
                        placeholder="Enter Tag..."
                        class="border w-min bg-apex-blue text-white"
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>