<script lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { useGameStore } from '@/stores/GameStore';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Note from './Note.vue';
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import NoteModal from './NoteModal.vue';
import EllipsisIcon from './icons/EllipsisIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import AddIcon from './icons/AddIcon.vue';
import { getGameId, getCharacterId } from '@/common/helpers';
export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        
        const authStore = useAuthStore();
        const characterStore = useCharacterStore();
        const gameStore = useGameStore();
        const characterNotes = computed(() => characterStore.characterNoteListDisplay);

        const characterNoteSearchInput = ref(null);

        const createNoteActive = ref(false);
        const createNoteTitle = ref(null);
        const createNoteBody = ref(null);
        
        const viewNoteActive = ref(false);
        const viewNoteTitle = ref(null);
        const viewNoteBody = ref(null);

        const editNoteActive = ref(false);
        const editNoteId = ref(0);
        const editNoteTitle = ref(null);
        const editNoteBody = ref(null);

        const characterNoteOptionsActive = ref([]);
        const characterNoteEditActive = ref(0);
        const toggleNoteOptions = (noteId: string) => {
            if(!characterNoteOptionsActive.value.includes(noteId)) {
                characterNoteOptionsActive.value.push(noteId);
            } else if(characterNoteOptionsActive.value.includes(noteId)) {
                characterNoteOptionsActive.value.splice(characterNoteOptionsActive.value.indexOf(noteId), 1);
            }

            console.log(characterNoteOptionsActive.value);
        }

        const openCreateNoteModal = () => {
            createNoteActive.value = !createNoteActive.value;
        };
        const closeCreateNoteModal = () => {
            createNoteActive.value = !createNoteActive.value;
        };
        const saveCharacterNote = () => {

            const gameId = getGameId();
            const characterId = getCharacterId();
            const characterNote = {
                'title': createNoteTitle.value,
                'body': createNoteBody.value
            }


            characterStore.saveCharacterNote(gameId, characterId, characterNote)
            .then(() => {
                createNoteActive.value = !createNoteActive.value
                createNoteTitle.value = null;
                createNoteBody.value = null;
            });
        };


        const updateCharacterNote = () => {

            const gameId = getGameId();
            const characterId = getCharacterId();
            const characterNote = {
                'id': editNoteId.value,
                'title': editNoteTitle.value,
                'body': editNoteBody.value
            }


            characterStore.updateCharacterNote(gameId, characterId, characterNote)
            .then(() => {
                editNoteActive.value = !editNoteActive.value
                editNoteTitle.value = null;
                editNoteBody.value = null;
            });
        };
        
        const openEditNoteModal = (characterNote: object) => {
            editNoteActive.value = !editNoteActive.value;

            if(editNoteActive.value) {
                editNoteId.value = characterNote.id;
                editNoteTitle.value = characterNote.title;
                editNoteBody.value = characterNote.body;
            }
        };

        const closeEditNoteModal = () => {
            editNoteActive.value = !editNoteActive.value;
        }

        const deleteCharacterNote = (noteId: string) => {
            if(window.confirm("Are you sure you want to delete this note?")) {
                const gameId = getGameId();
                const characterId = getCharacterId();
                characterStore.deleteCharacterNote(gameId, characterId, noteId)
                .then(() => {
                    toggleNoteOptions(noteId);
                })
            }
        };

        const toggleViewCharacterNote = (characterNote: object) => {
            viewNoteActive.value = !viewNoteActive.value;

            if(viewNoteActive.value) {
                viewNoteTitle.value = characterNote.title;
                viewNoteBody.value = characterNote.body;
            }
        };

        const updateCreateNoteTitle = (noteTitle: string) => {
            // console.log(noteTitle);
            createNoteTitle.value = noteTitle;
        };
        const updateCreateNoteBody = (noteBody: string) => {
            createNoteBody.value = noteBody;
        };

        const updateEditNoteTitle = (noteTitle: string) => {
            editNoteTitle.value = noteTitle;
        };
        const updateEditNoteBody = (noteBody: string) => {
            editNoteBody.value = noteBody;
        };

        watch(characterNoteSearchInput, () => {
            characterStore.updateCharacterNoteSearchCriteria(characterNoteSearchInput.value)
                .then(() => {
                    characterStore.updateCharacterNoteListDisplay();
                });

        });
        return {
            authStore,
            characterStore,
            characterNotes,
            characterNoteSearchInput,
            createNoteActive,
            openCreateNoteModal,
            closeCreateNoteModal,
            createNoteTitle,
            createNoteBody,
            viewNoteActive,
            viewNoteTitle,
            viewNoteBody,
            saveCharacterNote,
            updateCharacterNote,
            toggleViewCharacterNote,
            updateCreateNoteTitle,
            updateCreateNoteBody,
            updateEditNoteTitle,
            updateEditNoteBody,
            characterNoteOptionsActive,
            toggleNoteOptions,
            characterNoteEditActive,
            deleteCharacterNote,
            openEditNoteModal,
            editNoteActive,
            editNoteId,
            editNoteTitle,
            editNoteBody,
            closeEditNoteModal
        }
    },
    components: {
        Note,
        MagnifyingGlass,
        NoteModal,
        EllipsisIcon,
        CloseIcon,
        AddIcon
    }
}
</script>
<template lang="">
    <div class="mt-8 px-2">
        <div class="">
            <!-- <div v-if="characterNotes.length !== 0" class="flex flex-row w-full items-center">
                <MagnifyingGlass class="h-10 w-10" />
                <input 
                    type="text" 
                    placeholder="Search notes" 
                    v-model="characterNoteSearchInput" 
                    class="my-8"
                >
            </div> -->
            <div v-if="authStore.loggedInUser === null" class="flex flex-row justify-center">
                <p class="font-bold text-xl text-center">Must be logged in to view character notes!</p>
            </div>
            <div v-if="authStore.loggedInUser !== null">
                <p v-if="characterNotes.length === 0" class="flex justify-center font-bold text-2xl">Add your notes!</p>
            </div>
            <div class="xs:h-[19.5rem] lg:h-[26rem] overflow-y-auto space-y-2 ">
                <ul class="space-y-2">
                    <li v-for="characterNote in characterNotes" :key="characterNote.id">
                        <div>
                            <Note 
                                :note="characterNote"
                                class="border rounded p-2"
                                @click="toggleViewCharacterNote(characterNote)"
                            />
                        </div>
                        <div>
                            <div class="flex flex-row justify-end space-x-2">
                                <button v-if="characterNoteOptionsActive.includes(characterNote.id)" @click="deleteCharacterNote(characterNote.id)">
                                    <span class="border border-red rounded p-2 bg-red font-bold text-white">Delete</span>
                                </button>
                                <button v-if="characterNoteOptionsActive.includes(characterNote.id)" @click="toggleNoteOptions(characterNote.id, $event)">
                                    <span v-if="characterNoteEditActive === characterNote.id" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                                    <span v-else class="border border-blue rounded p-2 bg-blue font-bold text-white" @click="openEditNoteModal(characterNote)">Edit</span>
                                </button>
                                <CloseIcon v-if="characterNoteOptionsActive.includes(characterNote.id)" class="h-10 w-10" aria-labelledby="Close note options" @click="toggleNoteOptions(characterNote.id, $event)"/>
                                <EllipsisIcon v-else class="h-10 w-10" aria-labelledby="Open note options" @click="toggleNoteOptions(characterNote.id, $event)" />
                            </div>

                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <NoteModal 
            :viewCondition="createNoteActive"
            :mode="'create'"
            :noteTitle="createNoteTitle" 
            :noteBody="createNoteBody"
            @trigger-create-note-modal="openCreateNoteModal()"
            @trigger-close-note-modal="closeCreateNoteModal()"
            @trigger-save-note="saveCharacterNote()"
            @update-create-note-title="updateCreateNoteTitle"
            @update-create-note-body="updateCreateNoteBody"
        />
        <NoteModal 
            :viewCondition="viewNoteActive"
            :mode="'view'"
            :noteTitle="viewNoteTitle" 
            :noteBody="viewNoteBody"
            @trigger-create-note-modal="toggleViewCharacterNote()"
            @trigger-close-note-modal="toggleViewCharacterNote()"
        />
        <NoteModal 
            :viewCondition="editNoteActive"
            :mode="'edit'"
            :noteTitle="editNoteTitle" 
            :noteBody="editNoteBody"
            @trigger-create-note-modal="openEditNoteModal()"
            @trigger-close-note-modal="closeEditNoteModal()"
            @trigger-update-note="updateCharacterNote()"
            @update-edit-note-title="updateEditNoteTitle"
            @update-edit-note-body="updateEditNoteBody"
        />
        <div v-if="authStore.loggedInUser !== null">
            <AddIcon
                v-if="createNoteActive !== true"
                class="h-20 w-20 absolute bottom-4 right-4"
                :class="{ 'hidden': viewNoteActive === true || editNoteActive === true}"
                @click="openCreateNoteModal()" 
            />
        </div>
    </div>
</template>
<style lang="">
    
</style>