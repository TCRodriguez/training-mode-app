<script lang="ts">
import DirectionalInput from './DirectionalInput.vue';
import AttackButton from './AttackButton.vue';
import GameNotation from './GameNotation.vue';
import CloseIcon from './icons/CloseIcon.vue';
import { useGameStore } from '@/stores/GameStore';
import { useComboStore } from '@/stores/ComboStore';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { NSpace, NSpin } from 'naive-ui';
import { getGameAbbreviation, getInputImgFilename } from '@/common/helpers';
export default {
    setup() {
        const gameStore = useGameStore();
        const comboStore = useComboStore();
        const { getCharacterComboTags } = storeToRefs(comboStore);
        const addTagInput = ref(null);

        const newTagLoading = computed(() => comboStore.newCharacterComboTagLoading);
        const handleAddTag = () => {
            comboStore.updateNewCharacterComboTagLoadingState();
        }

        return {
            gameStore,
            comboStore,
            getCharacterComboTags,
            addTagInput,
            getGameAbbreviation,
            getInputImgFilename,
            newTagLoading,
            handleAddTag
        }
    },
    props: {
        name: String,
        comboId: Number,
        iconFileName: String,
        inputs: Array,
        editTagsActive: {
            type: Array,
            default: () => []   
        }
    },
    components: {
        DirectionalInput, 
        AttackButton,
        GameNotation,
        CloseIcon,
        NSpace,
        NSpin
    }
}
</script>
<template lang="">
    <div>
        <div class="my-2">
            <p class="font-bold">{{ name }}</p>
        </div>
        <div class="flex flex-row overflow-x-auto space-x-2">
            <div v-for="(input, index) in inputs" :key="index" class="flex flex-col shrink-0">
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
                    class=""
                    :notation="input.notation"
                    :iconFileName="getInputImgFilename(input.notation)"
                />
            </div>
        </div>
        <div>
            <p class="font-bold">Tags</p>
            <div class="flex flex-row space-x-2 items-center flex-wrap">
                <div
                    v-for="(tag, index) in getCharacterComboTags(comboId)" 
                    :key="index" 
                    class="flex flex-row items-center"
                    :class=" {'p-1 rounded': editTagsActive.includes(comboId)}"
                >
                    <div class="flex flex-row">
                        <div>
                            <span>#{{tag.name}}</span>
                        </div>
                        <CloseIcon v-if="editTagsActive.includes(comboId)" class="h-6 w-6" @click="$emit('triggerRemoveTag', tag.id, comboId)" />
                    </div>
                </div>
                <div v-if="newTagLoading && editTagsActive.includes(comboId)" class="pr-2">
                    <n-space>
                        <n-spin size="small" stroke="#E6C900" />
                    </n-space>
                </div>
                <div class="">
                    <input 
                        v-if="editTagsActive.includes(comboId)"
                        ref="addTagInput"
                        @keyup.enter="handleAddTag(), $emit('saveTag', addTagInput.value, comboId), addTagInput.value = ''"
                        type="text" 
                        placeholder="Enter Tag..."
                        class="border w-min bg-apex-blue text-white rounded p-2"
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>