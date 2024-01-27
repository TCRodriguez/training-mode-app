<script lang="ts" setup>
import ResourceTagsList from './ResourceTagsList.vue';
import { computed } from 'vue';
import DOMPurify from 'dompurify';
const props = defineProps({
    note: Object
});

const previewLength = 100;
const notePreview = computed(() => {
    // Split the note body by newline characters to get an array of lines
    const lines = props.note.body.split('\n');

    // Determine the number of lines to include in the preview
    const maxLines = 3; // For example, limit to the first 3 lines

    // Take the first 'maxLines' lines and join them back into a single string
    let preview = lines.slice(0, maxLines).join('<br>');

    // Check if there were more lines than the max and add an ellipsis if so
    if (lines.length > maxLines) {
        preview += '...';
    }

    // Sanitize the preview
    return DOMPurify.sanitize(preview);
});
</script>
<template lang="">
    <div>
        <div class="text-wrap">

            <h3 class="font-bold text-2xl text-apex-yellow">{{note.title}}</h3>
            <p v-html="notePreview"></p>
        </div>
        <!-- * Add ResourceTagsList component here -->

    </div>
</template>
<style lang="">
    
</style>