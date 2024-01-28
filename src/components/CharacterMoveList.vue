<script lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { useCharacterMoveStore } from '@/stores/CharacterMoveStore';
import { useGameStore } from '@/stores/GameStore';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import CharacterMove from './CharacterMove.vue';
import CharacterMoveShowModal from './CharacterMoveShowModal.vue';

import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import EllipsisIcon from './icons/EllipsisIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import HelpCircleOutlineIcon from './icons/HelpCircleOutlineIcon.vue';
import OpenOutlineIcon from './icons/OpenOutlineIcon.vue';
import SearchBar from './SearchBar.vue';

import LegendOverlay from './LegendOverlay.vue';

export default {
    setup() {
        const authStore = useAuthStore();
        const characterMoveStore = useCharacterMoveStore();
        const gameStore = useGameStore();
        const route = useRoute();
        const router = useRouter();
        const addTagActive = ref(false);
        const searchMoves = ref(null);
        const searchOptionsModalActive = ref(false);
        const searchByOptionSelection = ref('name');
        const characterMoveOptionsActive = ref([]);
        const characterMoveEditTagsActive = ref([]);

        const searchCharacterMoveInputValue = computed(() => characterMoveStore.characterMoveNameSearchInputValue);
        const characterMoveSearchInput = ref('');
        const searchByTagsInput = ref('');

        const notLoggedInMessageActive = ref(false);

        const showLegendOverlay = ref(false);
        const openLegendOverlay = () => {
            showLegendOverlay.value = true;
        }
        const closeLegendOverlay = () => {
            showLegendOverlay.value = false;
        }

        const addTagToMove = (newTag, moveId) => {
            characterMoveStore.addTagToCharacterMove(route.params.game, route.params.character, moveId, newTag);
        }

        const toggleSearchOptionsModal = () => {
            searchOptionsModalActive.value = !searchOptionsModalActive.value;
        }

        const switchSearchByOption = (option: string) => {
            if(option === 'tags' && authStore.loggedInUser === null) {
                showNotLoggedInMessage();
                return;
            }
            characterMoveStore.resetCharacterMoveListDisplay();
            characterMoveSearchInput.value = '';
            searchByOptionSelection.value = option;
        }

        const addTagToSearchList = (event) => {
            if(event.target.tagName === 'SPAN' || event.target.tagName === 'DIV') {
                console.log('test');
                characterMoveStore.addCharacterMoveTagToSearchList(event.target.textContent);
                characterMoveStore.updateCharacterMovesListDisplay('tags');
                searchByTagsInput.value = '';
                return;
            }

            characterMoveStore.addCharacterMoveTagToSearchList(searchByTagsInput.value);
            characterMoveStore.updateCharacterMovesListDisplay('tags');
            searchByTagsInput.value = '';
        }

        const removeTagFromSearchList = (tag) => {
            characterMoveStore.removeCharacterMoveTagFromSearchList(tag);
            characterMoveStore.updateCharacterMovesListDisplay('tags');
        }

        const toggleMoveOptions = (moveId: number, event) => {
            if(event.target.__vueParentComponent !== undefined) {
                if(event.target.__vueParentComponent.attrs['aria-labelledby'] === 'Close move options') {
                    characterMoveOptionsActive.value.splice(characterMoveOptionsActive.value.indexOf(moveId), 1);
                    if(characterMoveEditTagsActive.value.includes(moveId)) {
                        toggleEditTagsMode(moveId);
                    }
                }
                return;
            }

            if(!characterMoveOptionsActive.value.includes(moveId)) {
                characterMoveOptionsActive.value.push(moveId);
            } else if(characterMoveOptionsActive.value.includes(moveId)) {
                characterMoveOptionsActive.value.splice(characterMoveOptionsActive.value.indexOf(moveId), 1);
            }

        }
        

        const toggleEditTagsMode = (moveId: number) => {
            if(authStore.loggedInUser === null) {
                showNotLoggedInMessage();
                // setTimeout(() => {
                //     hideNotLoggedInMessage();
                // }, 3000);
                return;
            }

            if(!characterMoveEditTagsActive.value.includes(moveId)) {
                characterMoveEditTagsActive.value.push(moveId);
            } else if(characterMoveEditTagsActive.value.includes(moveId)) {
                characterMoveEditTagsActive.value.splice(characterMoveEditTagsActive.value.indexOf(moveId), 1);
            }
        }

        const showNotLoggedInMessage = () => {
            notLoggedInMessageActive.value = true;
            setTimeout(() => {
                hideNotLoggedInMessage();
            }, 3000);
        }

        const hideNotLoggedInMessage = () => {
            notLoggedInMessageActive.value = false;
        }

        const removeTagFromCharacterMove = (tagId: string, moveId: string) => {
            characterMoveStore.removeTagFromCharacterMove(route.params.game, route.params.character, moveId, tagId);
        }

        const openCharacterMoveModal = (moveId: number, moveInputs: object[]) => {
            characterMoveStore.setCharacterMove(moveId)
            .then(() => {
                showCharacterMoveModal.value = true;
                selectedCharacterMoveId.value = moveId;
            })
        }

        const closeCharacterMoveModal = (moveId: number) => {
            showCharacterMoveModal.value = false;
            selectedCharacterMoveId.value = null;
        }

        const showCharacterMoveModal = ref(false);

        const selectedCharacterMoveId = ref(null);

        const updateCharacterMoveSearchInput = (searchValue: string) => {
            characterMoveSearchInput.value = searchValue;

        }
        watch(characterMoveSearchInput, () => {
            characterMoveStore.updateCharacterMoveSearchCriteria(characterMoveSearchInput.value)
                .then(() => {
                    characterMoveStore.updateCharacterMovesListDisplay();
                })
        });

        const updateSearchByTagsInput = (searchValue: string) => {
            searchByTagsInput.value = searchValue;
        }

        watch(searchByTagsInput, () => {
            gameStore.updateTagSearchCriteria(searchByTagsInput.value)
            .then(() => {
                gameStore.updateTagsListDisplay();
            });

            if(searchByTagsInput.value.length === 0) {
                gameStore.updateTagsListDisplay();
            }
        });

        return {
            authStore,
            characterMoveStore,
            gameStore,
            route,
            router,
            
            addTagActive,
            addTagToMove,
            searchMoves,
            searchCharacterMoveInputValue,
            characterMoveSearchInput,
            toggleSearchOptionsModal,
            searchOptionsModalActive,
            searchByOptionSelection,
            characterMoveOptionsActive,
            characterMoveEditTagsActive,
            switchSearchByOption,
            searchByTagsInput,
            addTagToSearchList,
            removeTagFromSearchList,
            toggleMoveOptions,
            toggleEditTagsMode,

            notLoggedInMessageActive,
            showNotLoggedInMessage,
            hideNotLoggedInMessage,

            removeTagFromCharacterMove,

            openCharacterMoveModal,
            closeCharacterMoveModal,
            showCharacterMoveModal,
            selectedCharacterMoveId,

            openLegendOverlay,
            closeLegendOverlay,
            showLegendOverlay,

            updateCharacterMoveSearchInput,
            updateSearchByTagsInput
        }
    },
    created() {
        this.characterMoveStore.fetchCharacterMoves(this.route.params.game, this.route.params.character);
    },
    components: {
        CharacterMove,
        CharacterMoveShowModal,
        MagnifyingGlass,
        EllipsisIcon,
        CloseIcon,
        OpenOutlineIcon,
        HelpCircleOutlineIcon,
        LegendOverlay,
        SearchBar
    }

}
</script>
<template lang="">
    <div class="lg:px-80">
        <div class="my-2 flex flex-col space-x-2" :class="{'hidden': characterMoveStore.characterMoves.length === 0 }">
            <div class="flex flex-row items-center justify-between space-x-2 my-2">
                <div class="flex flex-row items-center space-x-2">

                    <p>Search by:</p>
                    <button
                        class="text-white p-1" 
                        :class="{ 'border rounded': searchByOptionSelection === 'name'}"
                        @click="switchSearchByOption('name')"
                    >
                        <span>Name</span>
                    </button>
                    <button
    
                        class="text-white p-1" 
                        :class="{ 'border rounded': searchByOptionSelection === 'tags', 'opacity-50': authStore.loggedInUser === null}"
                        @click="switchSearchByOption('tags')"
                    >
                        <span>Tags</span>
                    </button>
                </div>
                <div v-if="notLoggedInMessageActive === true">
                    <p class="text-black rounded bg-yellow p-1 xs:text-xs lg:text-lg">Log in to search by tags!</p>
                </div>
                <div>
                    <HelpCircleOutlineIcon class="h-10 w-10 fill-white" @click="openLegendOverlay()" />
                    <LegendOverlay
                        :showLegendOverlay="showLegendOverlay === true"
                        :showGameNotations="false"
                        :showAttackButtons="true"
                        :closeIconStyles="['text-white', 'h-20', 'w-20', 'fill-white']"
                        :descriptionsStyles="['text-white', 'text-lg']"
                        :descriptionsContainerStyles="['space-y-4', 'xs:h-[49rem]']"
                        @trigger-close-legend-overlay="closeLegendOverlay()"
                    />
                </div>
            </div>
            <div class="flex flex-row items-center px-2">
                <SearchBar 
                    v-if="searchByOptionSelection === 'name'"
                    :placeholder="'Enter move name'"
                    :searchType="'title'"
                    @trigger-update-search-input="updateCharacterMoveSearchInput"
                />
                <SearchBar 
                    v-if="searchByOptionSelection === 'tags'"
                    :placeholder="'Enter tags'"
                    :searchType="'tags'"
                    :value="searchByTagsInput"
                    @trigger-update-search-by-tags-input="updateSearchByTagsInput" 
                    @trigger-add-tag-to-search-list="addTagToSearchList" 
                />
            </div>
            <div class="flex flex-row space-x-2 flex-wrap">
                <div v-if="searchByTagsInput.length !== 0" v-for="(tag, index) in gameStore.tagsListDisplay" class="border rounded p-1">
                    <div class="" @click="addTagToSearchList($event)" @keydown.enter="addTagToSearchList($event)" tabindex="0">
                        <button>
                            <span>{{tag.name}}</span>
                        </button>
                    </div>
                </div>
                <div v-for="(tag, index) in characterMoveStore.searchByTagsList" :key="index" class="">
                    <div
                        class="flex flex-row items-center bg-apex-yellow text-black rounded p-1 space-x-1"
                    >
                        <span>{{tag}}</span>
                        <CloseIcon class="h-5 w-5" @click="removeTagFromSearchList(tag)" />
                    </div>
                </div>
                <div v-if="gameStore.tagsListDisplay.length !== 0" class="flex flex-row items-center italic">
                    <p class="opacity-50">*Click tag to add*</p>
                </div>
            </div>
        </div>
        <div v-if="characterMoveStore.characterMoves.length === 0" class="mt-32">
            <div class="flex flex-col items-center justify-center space-y-8">
                <p class="text-white text-4xl">Move list not yet added.</p>
                <p class="text-white text-xl px-2">If you'd like to help with adding move data, let us know on <a href="https://discord.gg/VBdTfJyddy" class="pointer text-apex-yellow" target="_blank">Discord</a>!. You can also send us an email at <a href="mailto:support@trainingmode.gg" class="text-apex-yellow">support@trainingmode.gg</a>.</p>
            </div>
        </div>
        <div class="">
            <ul class="xs:h-[18rem] lg:h-[24rem] overflow-y-auto overflow-x-hidden space-y-2 pb-8">
                <li 
                    v-for="(move, index) in characterMoveStore.characterMoveListDisplay" 
                    :key="index"
                    class="flex flex-col"
                >
                    <div class="flex flex-row">
                        <p v-for="(followUp, index) in move.follows_up">Follow up to: {{followUp.name}}</p>
                        <CharacterMove 
                            @save-tag="addTagToMove"
                            @trigger-remove-tag="removeTagFromCharacterMove"
                            :addTagInputActive="addTagActive"
                            :moveName="move.name"
                            :moveType="move.type"
                            :moveId="move.id"
                            :inputs="move.inputs" 
                            :tags="move.tags"
                            :editTagsActive="characterMoveEditTagsActive"
                            class="border rounded p-2 w-full bg-white text-black"
                        />
                    </div>
                    <div v-if="authStore.loggedInUser !== null" class="flex flex-row justify-end items-center space-x-2">
                        <p v-if="notLoggedInMessageActive" class="">Must be logged in!</p>
                        <button v-if="characterMoveOptionsActive.includes(move.id)" @click="toggleEditTagsMode(move.id)">
                            <span v-if="characterMoveEditTagsActive.includes(move.id)" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                            <span v-else class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Edit Tags</span>
                        </button>
                        <CloseIcon v-if="characterMoveOptionsActive.includes(move.id)" class="h-10 w-10" aria-labelledby="Close move options" @click="toggleMoveOptions(move.id, $event)" />
                        <EllipsisIcon v-else class="h-10 w-10 fill-white" aria-labelledby="Open move options" @click="toggleMoveOptions(move.id, $event)" />
                        <div>
                            <OpenOutlineIcon class="h-10 w-10" @click="openCharacterMoveModal(move.id, move.inputs)" />
                        </div>
                    </div>
                    <div v-if="selectedCharacterMoveId === move.id">
                        <CharacterMoveShowModal
                            @trigger-close-character-move-modal="closeCharacterMoveModal(move.id)"
                            :moveId="move.id"
                            :model="'move'"
                            :moveName="move.name"
                            :inputs="move.inputs" 
                            :moveNotes="move.notes"
                            :showCharacterMoveModal="showCharacterMoveModal"
                        />
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="">
    
</style>