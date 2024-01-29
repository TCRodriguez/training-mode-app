<script lang="ts" setup>
import CharacterMove from './CharacterMove.vue';
import NoteList from './NoteList.vue';
import CloseIcon from './icons/CloseIcon.vue';
import NoteModal from './NoteModal.vue';
import DocumentTextOutlineIcon from './icons/DocumentTextOutlineIcon.vue'
import { ref } from 'vue';

const showNoteModal = ref(false);
const noteModalMode = ref('');
const openNoteModal = (mode: 'create' | 'view' | 'update') => {
    noteModalMode.value = mode;
    showNoteModal.value = true;
}
const closeNoteModal = () => {
    showNoteModal.value = false;
}

const props = defineProps({
    moveName: String,
    moveId: Number,
    model: String,
    inputs: Array,
    moveNotes: Array,
    showCharacterMoveActive: Boolean,
    characterMoveEditTagsActive: Boolean
})
</script>
<template lang="">
    <div>
        <div class="bg-black opacity-[.85] fixed h-screen w-full top-0 left-0 right-0 bottom-0"></div>
        <div class="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center">
            <div class="w-full h-full flex flex-col items-center">
                <div class="p-2 w-[90%] bg-apex-blue flex flex-col justify-between rounded xs:mt-1 lg:mt-16">
                    <div>
                        <div>
                            <CharacterMove
                                class="border rounded p-2 overflow-x-auto w-full bg-white text-black"
                                :moveName="moveName"
                                :inputs="inputs"
                                :moveId="moveId"
                            />
                        </div>
                        <div class="mt-4 space-y-2">
                            <h3 class="font-bold text-2xl">Notes</h3>
                            <NoteList :modelId="moveId" :modelName="'move'" class="mt-2" />
                        </div>
                    </div>
                    <div class="flex flex-row justify-end space-x-4">
                        <div class="flex flex-col items-center" @click="openNoteModal('create')">
                            <DocumentTextOutlineIcon class="h-12 w-12" />
                            <p class="text-sm">Add Note</p>
                        </div>
                        <div class="flex flex-col items-center">
                            <CloseIcon class="h-12 w-12" @click="$emit('triggerCloseCharacterMoveModal')" />
                            <p class="text-sm">Close</p>
                        </div>

                    </div>
                </div>
            </div>
            <!-- <div>
                <NoteModal 
                    :viewCondition="showNoteModal" 
                    :mode="'show'" 
                    @trigger-close-note-modal="closeNoteModal()" />
            </div> -->
            <div v-if="showNoteModal === true">
                <NoteModal 
                    :mode="'create'"
                    :noteTitle="createNoteTitle" 
                    :noteBody="createNoteBody"
                    :model="model"
                    :viewCondition="showNoteModal"
                    @trigger-close-note-modal="closeNoteModal()"
                    @update-create-note-title="updateCreateNoteTitle"
                    @update-create-note-body="updateCreateNoteBody"
                />
                <!-- <NoteModal 
                    :viewCondition="showNoteModal" 
                    :mode="noteModalMode" 
                    @trigger-close-note-modal="closeNoteModal()" /> -->
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>