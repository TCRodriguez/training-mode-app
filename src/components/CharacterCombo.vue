<script lang="ts">
import DirectionalInput from './DirectionalInput.vue';
import AttackButton from './AttackButton.vue';
import CloseIcon from './icons/CloseIcon.vue';
import { useComboStore } from '@/stores/ComboStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
export default {
    setup() {
        const comboStore = useComboStore();
        const { getCharacterComboTags } = storeToRefs(comboStore);
        const addTagInput = ref(null);

        return {
            comboStore,
            getCharacterComboTags,
            addTagInput
        }
    },
    props: {
        comboId: Number,
        iconFileName: String,
        inputs: Array,
        editTagsActive: Array
    },
    components: {
        DirectionalInput, 
        AttackButton,
        CloseIcon
    }
}
</script>
<template lang="">
    <div>
        <div class="flex flex-row">
            <div v-for="(input, index) in inputs" :key="index" class="flex flex-col shrink-0">
                <!-- {{input.icon_file_name}} -->
                <!-- <img
                    :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/${input.img_category}%2Ftekken-7%2F${input.icon_file_name}`" 
                    alt="" 
                > -->
                <DirectionalInput 
                    v-if="input.img_category === 'directional-inputs'" :iconFileName="input.icon_file_name"
                    class="h-12 w-12"
                />               

                <AttackButton 
                    v-if="input.img_category === 'attack-buttons'" :iconFileName="input.icon_file_name"
                    class="h-12 w-12"
                />
            </div>
        </div>
        <div>
            <p class="font-bold">Tags</p>
            <div class="flex flex-row space-x-2 items-center flex-wrap">
                <!-- <div
                    v-for="(tag, index) in tags" 
                    :key="index" 
                    class="flex flex-row items-center"
                    :class=" {'p-1 rounded': editTagsActive === moveId}"
                > -->
                <div
                    v-for="(tag, index) in getCharacterComboTags(comboId)" 
                    :key="index" 
                    class="flex flex-row items-center"
                    :class=" {'p-1 rounded': editTagsActive.includes(comboId)}"
                >
                    <!-- <div v-if="!removedTagIds.includes(tag.id)" class="flex flex-row"> -->
                    <div class="flex flex-row">
                        <div>
                            <span>#{{tag.name}}</span>
                        </div>
                        <CloseIcon v-if="editTagsActive.includes(comboId)" class="h-6 w-6" @click="$emit('triggerRemoveTag', tag.id, comboId)" />
                    </div>
                </div>
                <div class="">
                    <input 
                        v-if="editTagsActive.includes(comboId)"
                        ref="addTagInput"
                        @keyup.enter="$emit('saveTag', addTagInput.value, comboId), addTagInput.value = ''"
                        type="text" 
                        placeholder="Enter Tag..."
                        class="border w-min"
                    >
                </div>
                <!-- <button v-if="editTagsActive.includes(comboId)" @click="$emit('addTagPressed')">
                    <AddIconOutline class="h-6 w-6" />
                    <EllipsisIcon />
                </button> -->
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>