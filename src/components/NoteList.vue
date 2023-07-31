<script lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { useGameStore } from '@/stores/GameStore';
import { useCharacterMoveStore } from '@/stores/CharacterMoveStore';
import { useComboStore } from '@/stores/ComboStore';

import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Note from './Note.vue';
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import NoteModal from './NoteModal.vue';
import EllipsisIcon from './icons/EllipsisIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import AddIcon from './icons/AddIcon.vue';

import { getGameId, getCharacterId, updateSearchNoteByTextCriteria } from '@/common/helpers';
export default {
    setup(props) {
        const route = useRoute();
        const router = useRouter();
        
        const authStore = useAuthStore();
        const characterStore = useCharacterStore();
        const gameStore = useGameStore();
        const characterMoveStore = useCharacterMoveStore();
        const comboStore = useComboStore();

        const notes = computed(() => {
            const retrieveNoteList = {
                'game': function () {
                    return gameStore.gameNoteListDisplay;
                },
                'character': function () {
                    return characterStore.characterNoteListDisplay;
                },
                'move': function () {
                    return characterMoveStore.characterMoveNoteListDisplay;
                },
                'combo': function () {
                    console.log(comboStore.characterComboNoteListDisplay);
                    return comboStore.characterComboNoteListDisplay;
                }
            };
            return retrieveNoteList[props.modelName]();
        })

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

        const noteOptionsActive = ref([]);
        const noteEditActive = ref(0);
        const toggleNoteOptions = (noteId: string) => {
            if(!noteOptionsActive.value.includes(noteId)) {
                noteOptionsActive.value.push(noteId);
            } else if(noteOptionsActive.value.includes(noteId)) {
                noteOptionsActive.value.splice(noteOptionsActive.value.indexOf(noteId), 1);
            }

            console.log(noteOptionsActive.value);
        }

        const openCreateNoteModal = () => {
            createNoteActive.value = !createNoteActive.value;
        };
        const closeCreateNoteModal = () => {
            createNoteActive.value = !createNoteActive.value;
        };
        
        const openEditNoteModal = (note: object) => {
            editNoteActive.value = true;
            console.log(note);
            if(editNoteActive.value) {
                editNoteId.value = note.id;
                editNoteTitle.value = note.title;
                editNoteBody.value = note.body;
            }
        };

        const closeEditNoteModal = () => {
            editNoteActive.value = false;
        }

        const deleteNote = (noteId: string, modelName: 'game' | 'character' | 'move' | 'combo') => {
            if(window.confirm("Are you sure you want to delete this note?")) {
                const gameId = getGameId();
                const characterId = getCharacterId();
                const characterMoveId = characterMoveStore.characterMove.id;
                const comboId = comboStore.combo.id;

                const deleteNoteStoreActions = {
                    'game': function () {
                        return gameStore.deleteGameNote(gameId, noteId);
                    },
                    'character': function () {
                        return characterStore.deleteCharacterNote(gameId, characterId, noteId)
                    },
                    'move': function () {
                        return characterMoveStore.deleteCharacterMoveNote(gameId, characterId, characterMoveId, noteId)
                    },
                    'combo': function () {
                        return comboStore.deleteCharacterComboNote(gameId, characterId, comboId, noteId)
                    }
                };
            deleteNoteStoreActions[modelName]();
            }
        };

        const toggleViewNote = (note: object) => {
            viewNoteActive.value = !viewNoteActive.value;

            if(viewNoteActive.value) {
                viewNoteTitle.value = note.title;
                viewNoteBody.value = note.body;
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

        const searchNoteByTextInput = ref('');
        const searchByOptionSelection = ref('text');

        const searchCharacterMoveInputValue = computed(() => characterMoveStore.characterMoveNameSearchInputValue);
        const characterMoveSearchInput = ref('');
        const searchByTagsInput = ref('');


        const notLoggedInMessageActive = ref(false);
        const showNotLoggedInMessage = () => {
            notLoggedInMessageActive.value = true;
            setTimeout(() => {
                hideNotLoggedInMessage();
            }, 3000);
        }
        const hideNotLoggedInMessage = () => {
            notLoggedInMessageActive.value = false;
        }


        const switchSearchByOption = (option: string) => {
            if(option === 'tags' && authStore.loggedInUser === null) {
                showNotLoggedInMessage();
                return;
            }

            const resetNoteListDisplays = {
                'game': function () {
                    gameStore.resetGameNoteListDisplay();
                    searchNoteByTextInput.value = '';
                },
                'character': function () {

                },
                'move': function () {
                    // characterMoveStore.resetCharacterMoveListDisplay();
                    // characterMoveSearchInput.value = '';
                },
                'combo': function () {

                }
            }


            searchByOptionSelection.value = option;
            console.log(searchByOptionSelection.value);
        }


    //     const createNoteStoreActions = {
    //     'game': function () {
    //         return gameStore.saveGameNote(gameId, note);
    //     },
    //     'character': function () {
    //         return characterStore.saveCharacterNote(gameId, characterId, note)
    //     },
    //     'move': function () {
    //         return characterMoveStore.saveCharacterMoveNote(gameId, characterId, characterMoveId, note)
    //     },
    //     'combo': function () {
    //         return comboStore.saveCharacterComboNote(gameId, characterId, comboId, note)
    //     }
    // };
    // createNoteStoreActions[modelName]()
    // .then(() => {
    //     createNoteActive.value = !createNoteActive.value
    //     createNoteTitle.value = null;
    //     createNoteBody.value = null;
    // });











        watch(searchNoteByTextInput, () => {
            updateSearchNoteByTextCriteria(props.modelName, searchNoteByTextInput.value);
        });

        // watch(searchNoteByTagsInput, () => {
        //     gameStore.updateTagSearchCriteria(searchNoteByTagsInput.value)
        //     .then(() => {
        //         gameStore.updateTagsListDisplay();
        //     })
        // });
        return {
            authStore,
            characterStore,
            notes,
            searchNoteByTextInput,
            createNoteActive,
            openCreateNoteModal,
            closeCreateNoteModal,

            createNoteTitle,
            createNoteBody,
            viewNoteActive,
            viewNoteTitle,
            viewNoteBody,

            toggleViewNote,
            updateCreateNoteTitle,
            updateCreateNoteBody,
            updateEditNoteTitle,
            updateEditNoteBody,
            noteOptionsActive,
            toggleNoteOptions,
            noteEditActive,
            deleteNote,
            openEditNoteModal,
            editNoteActive,
            editNoteId,
            editNoteTitle,
            editNoteBody,
            closeEditNoteModal,

            switchSearchByOption,
            searchByOptionSelection,
        }
    },
    components: {
        Note,
        MagnifyingGlass,
        NoteModal,
        EllipsisIcon,
        CloseIcon,
        AddIcon
    },
    props: {
        modelName: String,
        modelId: Number,
        showAddIcon: Boolean
    }
}
</script>
<template lang="">
    <div class="mt-8 px-2 w-full">
        <div class="">
            <div v-if="authStore.loggedInUser !== null" class="flex flex-row items-center space-x-2">

                <p>Search by:</p>
                <button
                    class="text-black p-1" 
                    :class="{ 'border rounded': searchByOptionSelection === 'text'}"
                    @click="switchSearchByOption('text')"
                >
                    <span>Text</span>
                </button>
                <button

                    class="text-black p-1" 
                    :class="{ 'border rounded': searchByOptionSelection === 'tags', 'opacity-50': authStore.loggedInUser === null}"
                    @click="switchSearchByOption('tags')"
                >
                    <span>Tags</span>
                </button>
            </div>
            <div v-if="authStore.loggedInUser !== null" class="flex flex-row w-full items-center">
                <MagnifyingGlass class="h-10 w-10" />
                <input 
                    type="text" 
                    placeholder="Search notes" 
                    v-model="searchNoteByTextInput" 
                    class="my-8"
                >
                <!-- <input 
                    type="text" 
                    placeholder="Search tags" 
                    v-model="searchNoteByTagsInput" 
                    class="my-8"
                > -->
            </div>
            <div v-if="authStore.loggedInUser === null" class="flex flex-row justify-center">
                <p class="font-bold text-xl text-center">Must be logged in to view {{modelName}} notes!</p>
            </div>
            <div v-if="authStore.loggedInUser !== null">
                <p v-if="notes.length === 0" class="flex justify-center font-bold text-2xl">Add your notes!</p>
            </div>
            <div class="xs:h-[24rem] lg:h-[26rem] overflow-y-auto space-y-2 ">
                <ul class="space-y-2 pb-24">
                    <li v-for="note in notes" :key="note.id">
                        <div>
                            <Note 
                                :note="note"
                                class="border rounded p-2"
                                @click="toggleViewNote(note)"
                            />
                        </div>
                        <div>
                            <div class="flex flex-row justify-end space-x-2">
                                <button v-if="noteOptionsActive.includes(note.id)" @click="deleteNote(note.id, modelName)">
                                    <span class="border border-red rounded p-2 bg-red font-bold text-white">Delete</span>
                                </button>
                                <button v-if="noteOptionsActive.includes(note.id)" @click="toggleNoteOptions(note.id, $event)">
                                    <span v-if="noteEditActive === note.id" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                                    <span v-else class="border border-blue rounded p-2 bg-blue font-bold text-white" @click="openEditNoteModal(note)">Edit</span>
                                </button>
                                <CloseIcon v-if="noteOptionsActive.includes(note.id)" class="h-10 w-10" aria-labelledby="Close note options" @click="toggleNoteOptions(note.id, $event)"/>
                                <EllipsisIcon v-else class="h-10 w-10" aria-labelledby="Open note options" @click="toggleNoteOptions(note.id, $event)" />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <NoteModal 
            :viewCondition="createNoteActive"
            :mode="'create'"
            :model="modelName"
            :noteTitle="createNoteTitle" 
            :noteBody="createNoteBody"
            @trigger-create-note-modal="openCreateNoteModal()"
            @trigger-close-note-modal="closeCreateNoteModal()"
            @trigger-save-note="saveNote()"
            @update-create-note-title="updateCreateNoteTitle"
            @update-create-note-body="updateCreateNoteBody"
        />
        <NoteModal 
            :viewCondition="viewNoteActive"
            :mode="'view'"
            :noteTitle="viewNoteTitle" 
            :noteBody="viewNoteBody"
            @trigger-create-note-modal="toggleViewNote()"
            @trigger-close-note-modal="toggleViewNote()"
        />
        <NoteModal 
            :viewCondition="editNoteActive"
            :mode="'edit'"
            :model="modelName"
            :noteTitle="editNoteTitle" 
            :noteBody="editNoteBody"
            :noteId="editNoteId"
            @trigger-create-note-modal="openEditNoteModal()"
            @trigger-close-note-modal="closeEditNoteModal()"
            @trigger-update-note="updateCharacterNote()"
            @update-edit-note-title="updateEditNoteTitle"
            @update-edit-note-body="updateEditNoteBody"
        />
        <div v-if="authStore.loggedInUser !== null && showAddIcon === true">
            <AddIcon
                v-if="createNoteActive !== true"
                class="h-20 w-20 absolute bottom-4 right-4 fill-green"
                :class="{ 'hidden': viewNoteActive === true || editNoteActive === true}"
                @click="openCreateNoteModal()" 
            />
        </div>
    </div>
</template>
<style lang="">
    
</style>