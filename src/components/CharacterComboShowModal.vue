<script lang="ts" setup>
import CharacterCombo from './CharacterCombo.vue';
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
    name: String,
    comboId: Number,
    inputs: Array,
    comboNotes: Array,
    showCharacterComboActive: Boolean,
    characterComboEditTagsActive: Boolean
})
</script>
<template lang="">
    <div>
        <div class="bg-black opacity-[.85] fixed h-screen w-full top-0 left-0 right-0 bottom-0 cursor-default"></div>
        <div class="absolute top-0 bottom-[-4rem] right-0 left-0 flex justify-center items-center cursor-default">
            <div class="w-full h-full flex flex-col justify-center items-center">
                <div class="p-2 w-[90%] bg-apex-blue flex flex-col justify-between rounded cursor-default">
                    <div>
                        <div>
                            <CharacterCombo
                                class="border rounded p-2 overflow-x-auto w-full bg-white text-black"
                                :name="name"
                                :inputs="inputs"
                                :comboId="comboId"
                            />
                        </div>
                        <div class="mt-4 space-y-2">
                            <h3 class="font-bold text-2xl">Notes</h3>
                            <NoteList :modelId="comboId" :modelName="'combo'" class="mt-2" />
                        </div>
                    </div>
                    <div class="flex flex-row justify-end space-x-4">
                        <div class="flex flex-col items-center cursor-pointer" @click="openNoteModal('create')">
                            <DocumentTextOutlineIcon class="h-12 w-12" />
                            <p class="text-sm">Add Note</p>
                        </div>
                        <div class="flex flex-col items-center cursor-pointer" @click="$emit('triggerCloseCharacterComboModal')" >
                            <CloseIcon class="h-12 w-12" />
                            <p class="text-sm">Close</p>
                        </div>

                    </div>
                </div>
            </div>
            <div v-if="showNoteModal === true">
                <NoteModal 
                    :mode="'create'"
                    :noteTitle="createNoteTitle" 
                    :noteBody="createNoteBody"
                    :model="'combo'"
                    :viewCondition="showNoteModal"
                    @trigger-close-note-modal="closeNoteModal()"
                    @update-create-note-title="updateCreateNoteTitle"
                    @update-create-note-body="updateCreateNoteBody"
                />
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>