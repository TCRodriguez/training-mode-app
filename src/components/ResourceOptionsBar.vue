<script lang="ts" setup>

const props = defineProps({
    resourceEditButton: Boolean,
    resourceDeleteButton: Boolean,
    resourceEditTagsButton: Boolean,
    optionsBarOpen: Boolean,
    resourceOptionsActive: Array,
    resourceId: Number,
    resourceData: Array

})

</script>
<template lang="">
    <div>
        <div>
            <div v-if="optionsBarOpen">
                <button @click="toggleEditTagsMode(resourceId)">
                    <span v-if="resourceOptionsActive.includes(resourceId)" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                    <span v-else class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Edit Tags</span>
                </button>
                <button v-if="resourceOptionsActive.includes(resourceId)" @click="deleteNote(resourceId, modelName)">
                    <span class="border border-red rounded p-2 bg-red font-bold text-white">Delete</span>
                </button>
                <button v-if="resourceOptionsActive.includes(resourceId)" @click="toggleNoteOptions(resourceId, $event)">
                    <span v-if="noteEditActive === resourceId" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                    <span v-else class="border border-blue rounded p-2 bg-blue font-bold text-white" @click="openEditNoteModal(note)">Edit</span>
                </button>
            </div>
            <CloseIcon v-if="resourceOptionsActive.includes(resourceId)" class="h-10 w-10" aria-labelledby="Close options" @click="toggleResourceOptions(resourceId, $event)" />
            <EllipsisIcon v-else class="h-10 w-10" aria-labelledby="Open options" @click="toggleResourceOptions(resourceId, $event)" />
            <div>
                <OpenOutlineIcon class="h-10 w-10" @click="openResourceModal(resourceId, resourceData)" />
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>