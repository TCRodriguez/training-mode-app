<script lang="ts" setup>
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import { ref } from 'vue';

const searchInput = ref('');

const props = defineProps({
    placeholder: String,
    searchType: String
})


</script>
<template lang="">
    <div class="flex flex-row border-2 rounded bg-white my-2 xs:w-full items-center lg:w-1/3">
        <MagnifyingGlass class="h-10 w-10 text-black border-black-300" />
        <input
            v-if="searchType === 'title'" 
            type="text" 
            :placeholder="placeholder" 
            class="bg-white text-black border-none m-0"
            @input="$emit('triggerUpdateSearchInput', $event.target.value)"
        >        
        <input
            v-if="searchType === 'tags'" 
            type="text" 
            :placeholder="placeholder" 
            class="bg-white text-black border-none m-0"
            @input="$emit('triggerUpdateSearchByTagsInput', $event.target.value)"
            @keyup.enter="$emit('triggerAddTagToSearchList', $event)"
        >        
    </div>
</template>
<style lang="">
    
</style>