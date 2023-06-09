<script lang="ts">
import Note from './Note.vue';
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import AddIcon from './icons/AddIcon.vue';
import CheckmarkIcon from './icons/CheckmarkIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
export default {
    setup(props) {




        return {
            
        }
    },
    components: {
        Note,
        MagnifyingGlass,
        AddIcon,
        CheckmarkIcon,
        CloseIcon,
    },
    props: {
        viewCondition: Boolean,
        noteTitle: String,
        noteBody: String,
        mode: String
    }
}
</script>
<template lang="">
    <div>
        <div class="bg-black opacity-[.99] fixed h-screen w-full top-0 left-0 right-0 bottom-0" :class="{ 'hidden': viewCondition === false }"></div>
        <div class="">
            <div class="absolute h-screen top-0 bottom-0 right-0 left-0 pt-16 px-4" :class="{'hidden': viewCondition === false }">
                <div v-if="mode === 'create'" class="flex flex-col">
                    <input type="text" :value="noteTitle" @input="$emit('updateCreateNoteTitle', $event.target.value)" class="bg-white" placeholder="Enter note title...">
                    <textarea name="" :value="noteBody" @input="$emit('updateCreateNoteBody', $event.target.value)" id="" class="bg-white" cols="30" rows="10"></textarea>
                </div>
                <div v-if="mode === 'edit'" class="flex flex-col">
                    <input type="text" :value="noteTitle" @input="$emit('updateEditNoteTitle', $event.target.value)" class="bg-white" placeholder="Enter note title...">
                    <textarea name="" :value="noteBody" @input="$emit('updateEditNoteBody', $event.target.value)" id="" class="bg-white" cols="30" rows="10"></textarea>
                </div>
                <div v-if="mode === 'view'" class="flex flex-col text-white space-y-2">
                    <!-- <input type="text" :value="noteTitle" @input="$emit('updateEditNoteTitle', $event.target.value)" class="bg-white" placeholder="Enter note title...">
                    <textarea name="" :value="noteBody" @input="$emit('updateEditNoteBody', $event.target.value)" id="" class="bg-white" cols="30" rows="10"></textarea> -->
                    <h3 class="text-3xl">{{ noteTitle }}</h3>
                    <p>{{ noteBody }}</p>
                </div>
            </div>
            <div class="">
                <CheckmarkIcon 
                    v-if="mode === 'create'"
                    class="h-20 w-20 fill-green absolute bottom-4 right-4"
                    :class="{ 'hidden': viewCondition === false }"
                    @click="$emit('triggerSaveNote')"
                />
                <CheckmarkIcon
                    v-if="mode === 'edit'"
                    class="h-20 w-20 fill-green absolute bottom-4 right-4"
                    :class="{ 'hidden': viewCondition === false }"
                    @click="$emit('triggerUpdateNote')"
                />
                <CloseIcon
                    class="h-20 w-20 text-red absolute bottom-4 left-4"
                    :class="{ 'hidden': viewCondition === false }"
                    @click="$emit('triggerCloseNoteModal')"
                />
            </div>    
        </div> 
    </div>
</template>
<style lang="">
    
</style>