<script lang="ts" setup>
import { useAuthStore } from '@/stores/AuthStore';
import CloseIcon from './icons/CloseIcon.vue';
import { ref } from 'vue';


const addTagInput = ref(null);

const authStore = useAuthStore();

const props = defineProps({
    // comboId: Number,
    // inputs: Array,
    // comboNotes: Array,
    // showCharacterComboActive: Boolean,
    // characterComboEditTagsActive: Boolean
    tags: Array,
    addTagInputActive: Boolean,
    editTagsActive: {
        type: Array,
        default: () => []   
    },
    resourceId: Number
})

</script>
<template lang="">
    <div>
        <div v-if="authStore.loggedInUser !== null" >
            <p class="font-bold">Tags</p>
            <div class="flex flex-row space-x-2 items-center flex-wrap">
                <div
                    v-for="(tag, index) in tags" 
                    :key="index" 
                    class="flex flex-row items-center"
                    :class=" {'p-1 rounded': editTagsActive.includes(resourceId)}"
                >
                    <div class="flex flex-row">
                        <div>
                            <span>#{{tag.name}}</span>
                        </div>
                        <CloseIcon v-if="editTagsActive.includes(resourceId)" class="h-6 w-6" @click="$emit('triggerRemoveTagFromResource', tag.id, resourceId)" />
                    </div>
                </div>
                <div class="">
                    <input 
                        v-if="editTagsActive.includes(resourceId)"
                        ref="addTagInput"
                        @keyup.enter="$emit('triggerAddTagToResource', addTagInput.value, resourceId), addTagInput.value = ''"
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