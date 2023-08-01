<script lang="ts">
export default {
    props: {
        note: Object
    }
}
</script>
<template lang="">
    <div>
        <div>

            <h3 class="font-bold text-lg">{{note.title}}</h3>
            <p>{{note.body}}</p>
            <div v-for="tag in note.tags" class="text-blue font-bold">#{{tag.name}}</div>
        </div>
        <!-- <div v-if="authStore.loggedInUser !== null" >
            <p class="font-bold">Tags</p>
            <div class="flex flex-row space-x-2 items-center flex-wrap">
                <div
                    v-for="(tag, index) in note.tags" 
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
        </div> -->
    </div>
</template>
<style lang="">
    
</style>