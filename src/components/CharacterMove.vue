<script lang="ts">
import DirectionalInput from './DirectionalInput.vue';
import AttackButton from './AttackButton.vue';
import AddIconOutline from './icons/AddIconOutline.vue';
import { useCharacterMoveStore } from '../stores/CharacterMoveStore';
// import EllipsisIcon from './icons/EllipsisIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import { storeToRefs } from 'pinia';

import { ref } from 'vue';
export default {
    setup(props) {
        const characterMoveStore = useCharacterMoveStore();
        const addTagInput = ref(null);
        // const tagsList = ref([]);
        // tagsList.value = [...props.tags]
        const removedTagIds = ref([]);
        // const removeTagFromFrontEnd = (tag: object) => {
        //     console.log(props.tags);
        //     // removedTagIds.value.push(tag.id);
        //     // console.log(removedTagIds.value);

        //     // props.tags?.splice(props.tags.indexOf())
        //     // props.tags?.filter(tag => tag.name !== tagName);
        // }

        const { getCharacterMoveTags } = storeToRefs(characterMoveStore);

        return {
            characterMoveStore,
            getCharacterMoveTags,
            addTagInput,
            // removeTagFromFrontEnd,
            removedTagIds
        }
    },
    props: {
        moveName: String,
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
        // EllipsisIcon
        CloseIcon
    }
}
</script>
<template lang="">
    <div>
        <div class="font-bold">
            {{ moveName }}
        </div>
        <div class="flex flex-row">
            <div v-for="(input, index) in inputs" :key="index" class="flex flex-col my-2">
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
                    v-for="(tag, index) in getCharacterMoveTags(moveId)" 
                    :key="index" 
                    class="flex flex-row items-center"
                    :class=" {'p-1 rounded': editTagsActive.includes(moveId)}"
                >
                    <!-- <div v-if="!removedTagIds.includes(tag.id)" class="flex flex-row"> -->
                    <div class="flex flex-row">
                        <div>
                            <span>#{{tag.name}}</span>
                        </div>
                        <CloseIcon v-if="editTagsActive.includes(moveId)" class="h-6 w-6" @click="$emit('triggerRemoveTag', tag.id, moveId), removeTagFromFrontEnd(tag)" />
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
                <!-- <button v-if="editTagsActive.includes(moveId)" @click="$emit('addTagPressed')">
                    <AddIconOutline class="h-6 w-6" />
                    <EllipsisIcon />
                </button> -->
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>