<script lang="ts">
import { useGameStore } from '@/stores/GameStore';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import NoteModal from './NoteModal.vue';
import EllipsisIcon from './icons/EllipsisIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import AddIcon from './icons/AddIcon.vue';
import Note from './Note.vue';



export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const gameStore = useGameStore();
        const gameNotes = computed(() => gameStore.gameNoteListDisplay);

        const gameNoteSearchInput = ref(null);
    

        const editNoteActive = ref(false);
        const editNoteId = ref(0);
        const editNoteTitle = ref(null);
        const editNoteBody = ref(null);

        const gameNoteOptionsActive = ref([]);
        const gameNoteEditActive = ref(0);

        const toggleNoteOptions = (noteId: string) => {
            if(!gameNoteOptionsActive.value.includes(noteId)) {
                gameNoteOptionsActive.value.push(noteId);
            } else if(gameNoteOptionsActive.value.includes(noteId)) {
                gameNoteOptionsActive.value.splice(gameNoteOptionsActive.value.indexOf(noteId), 1);
            }

            console.log(gameNoteOptionsActive.value);
        }

        const createNoteActive = ref(false);
        const createNoteTitle = ref('');
        const createNoteBody = ref('');
        const openCreateNoteModal = () => {
            createNoteActive.value = !createNoteActive.value;
        };
        const closeCreateNoteModal = () => {
            createNoteActive.value = !createNoteActive.value;
        };
        const updateCreateNoteTitle = (noteTitle: string) => {
            // console.log(noteTitle);
            createNoteTitle.value = noteTitle;
            console.log(createNoteTitle.value);
        };
        const updateCreateNoteBody = (noteBody: string) => {
            // console.log(noteTitle);
            createNoteBody.value = noteBody;
            console.log(createNoteBody.value);
        };
        const saveGameNote = () => {

            const game = gameStore.game;
            const gameNote = {
                'title': createNoteTitle.value,
                'body': createNoteBody.value
            }

            console.log(gameNote);


            gameStore.saveGameNote(game.id, gameNote)
            .then(() => {
                createNoteActive.value = !createNoteActive.value
                createNoteTitle.value = '';
                createNoteBody.value = '';
            });
        };

        const viewNoteActive = ref(false);
        const viewNoteTitle = ref(null);
        const viewNoteBody = ref(null);
        const toggleViewGameNote = (gameNote: object) => {
            console.log(gameNote);
            viewNoteActive.value = !viewNoteActive.value;

            if(viewNoteActive.value) {
                viewNoteTitle.value = gameNote.title;
                viewNoteBody.value = gameNote.body;
            }

            console.log(viewNoteTitle.value);
            console.log(viewNoteBody.value);

        };

        const updateGameNote = () => {
            const game = gameStore.game;
            const gameNote = {
                'id': editNoteId.value,
                'title': editNoteTitle.value,
                'body': editNoteBody.value
            }

            gameStore.updateGameNote(game.id, gameNote)
            .then(() => {
                editNoteActive.value = !editNoteActive.value
                editNoteTitle.value = null;
                editNoteBody.value = null;
            });
        };

        const updateEditNoteTitle = (noteTitle: string) => {
            // console.log(noteTitle);
            editNoteTitle.value = noteTitle;
            console.log(editNoteTitle.value);
        };
        const updateEditNoteBody = (noteBody: string) => {
            // console.log(noteTitle);
            editNoteBody.value = noteBody;
            console.log(editNoteBody.value);
        };
        const openEditNoteModal = (gameNote: object) => {
            editNoteActive.value = !editNoteActive.value;

            if(editNoteActive.value) {
                editNoteId.value = gameNote.id;
                editNoteTitle.value = gameNote.title;
                editNoteBody.value = gameNote.body;
            }
        };
        const closeEditNoteModal = () => {
            editNoteActive.value = !editNoteActive.value;
        }

        const deleteGameNote = (noteId: string) => {
            if(window.confirm("Are you sure you want to delete this note?")) {
                gameStore.deleteGameNote(route.params.game, noteId)
                .then(() => {
                    toggleNoteOptions(noteId);
                })
            }
        };


        return {
            route,
            router,
            gameStore,

            gameNotes,
            gameNoteSearchInput,

            gameNoteOptionsActive,
            toggleNoteOptions,

            createNoteActive,
            createNoteTitle,
            createNoteBody,
            openCreateNoteModal,
            closeCreateNoteModal,
            updateCreateNoteTitle,
            updateCreateNoteBody,
            saveGameNote,

            viewNoteActive,
            viewNoteTitle,
            viewNoteBody,
            toggleViewGameNote,

            editNoteActive,
            editNoteId,
            editNoteTitle,
            editNoteBody,
            gameNoteEditActive,
            openEditNoteModal,
            closeEditNoteModal,
            updateEditNoteTitle,
            updateEditNoteBody,
            updateGameNote,

            deleteGameNote
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
    <div class="mt-8 w-full">
        <div class="">
            <div v-if="gameNotes.length !== 0" class="flex flex-row w-full items-center">
                <MagnifyingGlass class="h-10 w-10" />
                <input 
                    type="text" 
                    placeholder="Search notes" 
                    v-model="gameNoteSearchInput" 
                    class="my-8"
                >
            </div>
            <p v-if="gameNotes.length === 0" class="flex justify-center font-bold text-2xl">Add your game notes!</p>
            <ul class="space-y-2 overflow-auto xs:h-[15rem] lg:h-96">
                <li v-for="gameNote in gameNotes" :key="gameNote.id">
                    <div>
                        <Note 
                            :note="gameNote"
                            class="border rounded p-2"
                            @click="toggleViewGameNote(gameNote)"
                        />
                    </div>
                    <div>
                        <div class="flex flex-row justify-end space-x-2">
                            <button v-if="gameNoteOptionsActive.includes(gameNote.id)" @click="deleteGameNote(gameNote.id)">
                                <span class="border border-red rounded p-2 bg-red font-bold text-white">Delete</span>
                            </button>
                            <!-- <button v-if="gameComboOptionsActive.includes(combo.id)" @click="toggleEditTagsMode(combo.id)">
                                <span v-if="gameComboEditTagsActive.includes(combo.id)" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                                <span v-else class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Edit Tags</span>
                            </button> -->
                            <button v-if="gameNoteOptionsActive.includes(gameNote.id)" @click="toggleNoteOptions(gameNote.id, $event)">
                                <span v-if="gameNoteEditActive === gameNote.id" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                                <span v-else class="border border-blue rounded p-2 bg-blue font-bold text-white" @click="openEditNoteModal(gameNote)">Edit</span>
                            </button>
                            <CloseIcon v-if="gameNoteOptionsActive.includes(gameNote.id)" class="h-10 w-10" aria-labelledby="Close note options" @click="toggleNoteOptions(gameNote.id, $event)"/>
                            <EllipsisIcon v-else class="h-10 w-10" aria-labelledby="Open note options" @click="toggleNoteOptions(gameNote.id, $event)" />
                        </div>

                    </div>
                </li>
            </ul>
        </div>
        <!-- Insert note modals here -->
        <NoteModal 
            :viewCondition="createNoteActive"
            :mode="'create'"
            :noteTitle="createNoteTitle" 
            :noteBody="createNoteBody"
            @trigger-create-note-modal="openCreateNoteModal()"
            @trigger-close-note-modal="closeCreateNoteModal()"
            @trigger-save-note="saveGameNote()"
            @update-create-note-title="updateCreateNoteTitle"
            @update-create-note-body="updateCreateNoteBody"
        />
        <NoteModal 
            :viewCondition="viewNoteActive"
            :mode="'view'"
            :noteTitle="viewNoteTitle" 
            :noteBody="viewNoteBody"
            @trigger-create-note-modal="toggleViewGameNote()"
            @trigger-close-note-modal="toggleViewGameNote()"
        />
        <NoteModal 
            :viewCondition="editNoteActive"
            :mode="'edit'"
            :noteTitle="editNoteTitle" 
            :noteBody="editNoteBody"
            @trigger-create-note-modal="openEditNoteModal()"
            @trigger-close-note-modal="closeEditNoteModal()"
            @trigger-update-note="updateGameNote()"
            @update-edit-note-title="updateEditNoteTitle"
            @update-edit-note-body="updateEditNoteBody"
        />
        <div>
            <AddIcon
                v-if="createNoteActive !== true"
                class="h-20 w-20 absolute bottom-2 right-2"
                :class="{ 'hidden': viewNoteActive === true || editNoteActive === true}"
                @click="openCreateNoteModal()" 
            />
        </div>
    </div>
</template>
<style lang="">
    
</style>