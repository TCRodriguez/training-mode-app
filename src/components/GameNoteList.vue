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

        const gameNoteOptionsActive = ref([]);
        const gameNoteEditActive = ref(0);


        return {
            route,
            router,
            gameStore,

            gameNotes,
            gameNoteSearchInput,

            gameNoteOptionsActive,
            gameNoteEditActive
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
        <div class="h-96 overflow-auto">
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
            <ul class="space-y-2">
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
                            <button v-if="gameNoteOptionsActive.includes(gameNote.id)" @click="deleteGameNote(characterNote.id)">
                                <span class="border border-red rounded p-2 bg-red font-bold text-white">Delete</span>
                            </button>
                            <!-- <button v-if="characterComboOptionsActive.includes(combo.id)" @click="toggleEditTagsMode(combo.id)">
                                <span v-if="characterComboEditTagsActive.includes(combo.id)" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
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
        <div>
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