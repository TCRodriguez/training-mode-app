<script lang="ts">
import { useCharacterMoveStore } from '@/stores/CharacterMoveStore';
import { useGameStore } from '@/stores/GameStore';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CharacterMove from './CharacterMove.vue';
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import EllipsisIcon from './icons/EllipsisIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
export default {
    setup() {
        const characterMoveStore = useCharacterMoveStore();
        const gameStore = useGameStore();
        const route = useRoute();
        const router = useRouter();
        // const addTagActive = ref(false);
        const searchMoves = ref(null);
        const searchOptionsModalActive = ref(false);
        const searchByOptionSelection = ref('tags');
        // const characterMoveOptionsActive = ref(0);
        const characterMoveOptionsActive = ref([]);
        // const characterMoveEditTagsActive = ref(0);
        const characterMoveEditTagsActive = ref([]);



        const searchCharacterMoveInputValue = computed(() => characterMoveStore.characterMoveNameSearchInputValue);
        const characterMoveSearchInput = ref('');
        const searchByTagsInput = ref('');


        const openAddTagInput = () => {
            // alert('test');
            addTagActive.value = !addTagActive.value;
        }

        const addTagToMove = (newTag, moveId) => {
            // alert(moveId);

            characterMoveStore.addTagToCharacterMove(route.params.game, route.params.character, moveId, newTag)
            .then(() => {
                // alert('yes?');
                // addTagActive.value = !addTagActive.value


            })
        }


        const toggleSearchOptionsModal = () => {
            // alert('yes');
            console.log(searchOptionsModalActive.value);
            searchOptionsModalActive.value = !searchOptionsModalActive.value;
        }

        const switchSearchByOption = (option: string) => {
            console.log(option);
            characterMoveStore.resetCharacterMoveListDisplay();
            characterMoveSearchInput.value = '';
            searchByOptionSelection.value = option;
        }

        const addTagToSearchList = (event) => {
            
            console.log(event);
            if(event.target.tagName === 'SPAN') {
                characterMoveStore.addCharacterMoveTagToSearchList(event.target.textContent);
                characterMoveStore.updateCharacterMovesListDisplay('tags');
                searchByTagsInput.value = '';
                return;
            }

            // console.log(searchByTagsInput.value);
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
                console.log(event.target.__vueParentComponent.attrs['aria-labelledby']);
                if(event.target.__vueParentComponent.attrs['aria-labelledby'] === 'Close move options') {
                    characterMoveOptionsActive.value.splice(characterMoveOptionsActive.value.indexOf(moveId), 1);
                    if(characterMoveEditTagsActive.value.includes(moveId)) {
                        toggleEditTagsMode(moveId);
                    }
                }
                return;
            }
            // if(event.target.__vueParentComponent.attrs.aria-labelledby === 'Close move options') {

            // }
            // if(characterMoveOptionsActive.value !== moveId) {
            //     characterMoveOptionsActive.value = moveId
            //     // toggleEditTagsMode(moveId);
            //     // characterMoveEditTagsActive.value = moveId
            // } else {
            //     characterMoveOptionsActive.value = 0;
            //     characterMoveEditTagsActive.value = 0;
            // }
            if(!characterMoveOptionsActive.value.includes(moveId)) {
                characterMoveOptionsActive.value.push(moveId);
            } else if(characterMoveOptionsActive.value.includes(moveId)) {
                characterMoveOptionsActive.value.splice(characterMoveOptionsActive.value.indexOf(moveId), 1);
            }

            console.log(characterMoveOptionsActive.value);
        }

        const toggleEditTagsMode = (moveId: number) => {
            // console.log(characterMoveEditTagsActive.value);
            // characterMoveEditTagsActive.value !== moveId 
            //     ? characterMoveEditTagsActive.value = moveId 
            //     : characterMoveEditTagsActive.value = 0;
            // console.log("characterMoveEditTagsActive is " + characterMoveEditTagsActive.value);
            if(!characterMoveEditTagsActive.value.includes(moveId)) {
                characterMoveEditTagsActive.value.push(moveId);
            } else if(characterMoveEditTagsActive.value.includes(moveId)) {
                characterMoveEditTagsActive.value.splice(characterMoveEditTagsActive.value.indexOf(moveId), 1);
            }

            console.log(characterMoveOptionsActive.value);
        }

        const removeTagFromCharacterMove = (tagId: string, moveId: string) => {
            console.log(tagId);
            console.log(moveId);
            // console.log(route.params.game);
            characterMoveStore.removeTagFromCharacterMove(route.params.game, route.params.character, moveId, tagId);
        }

        watch(characterMoveSearchInput, () => {
                console.log(characterMoveSearchInput.value);
                characterMoveStore.updateCharacterMoveSearchCriteria(characterMoveSearchInput.value)
                    .then(() => {
                        characterMoveStore.updateCharacterMovesListDisplay();
                    })
        });

        watch(searchByTagsInput, () => {
            // console.log(searchByTagsInput);
            gameStore.updateTagSearchCriteria(searchByTagsInput.value)
            .then(() => {
                gameStore.updateTagsListDisplay();
            })
        });

        return {
            characterMoveStore,
            gameStore,
            route,
            router,
            // addTagActive,
            openAddTagInput,
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
            removeTagFromCharacterMove

        }
    },
    created() {
        this.characterMoveStore.fetchCharacterMoves(this.route.params.game, this.route.params.character);
    },
    components: {
        CharacterMove,
        MagnifyingGlass,
        EllipsisIcon,
        CloseIcon

    }

}
</script>
<template lang="">
    <div>
        <div class="my-2 flex flex-col space-x-2">
            <div class="flex flex-row items-center space-x-2 my-2">
                <p>Search by:</p>
                <button
                    class="text-black p-1" 
                    :class="{ 'border rounded': searchByOptionSelection === 'name'}"
                    @click="switchSearchByOption('name')"
                >
                    <span>Name</span>
                </button>
                <button 
                    class="text-black p-1" 
                    :class="{ 'border rounded': searchByOptionSelection === 'tags'}"
                    @click="switchSearchByOption('tags')"
                >
                    <span>Tags</span>
                </button>
            </div>
            <div class="flex flex-row items-center">
                <MagnifyingGlass class="h-10 w-10" />
                <input v-if="searchByOptionSelection === 'name'" type="text" placeholder="Search by name" v-model="characterMoveSearchInput">
                <input v-if="searchByOptionSelection === 'tags'" type="text" placeholder="Enter tag" v-model="searchByTagsInput" @keyup.enter="addTagToSearchList($event)">
            </div>
            <div class="flex flex-row space-x-2 flex-wrap">
                <div v-if="searchByTagsInput.length !== 0" v-for="(tag, index) in gameStore.tagsListDisplay" class="border rounded p-1">
                    <div class="" @click="addTagToSearchList($event)">
                        <span>{{tag.name}}</span>
                    </div>
                </div>
                <div v-for="(tag, index) in characterMoveStore.searchByTagsList" :key="index" class="">
                    <div
                        class="flex flex-row items-center bg-blue text-white rounded p-1 space-x-1"
                        
                    >
                        <span>{{tag}}</span>
                        <CloseIcon class="h-5 w-5" @click="removeTagFromSearchList(tag)" />
                    </div>
                </div>
            </div>
            <!-- <div class="">
                <VerticalEllipsisIcon v-if="searchOptionsModalActive === false" class="h-10 w-10" @click="toggleSearchOptionsModal()" />
                <CloseIcon v-if="searchOptionsModalActive === true" class="h-10 w-10" @click="toggleSearchOptionsModal()" />
            </div> -->
        </div>
        <div class="">
            <ul class="space-y-2 overflow-y-auto">
                <li 
                    v-for="(move, index) in characterMoveStore.characterMoveListDisplay" 
                    :key="index"
                    class="flex flex-col"
                >
                    <div>
                        <CharacterMove 
                            @add-tag-pressed="openAddTagInput"
                            @save-tag="addTagToMove"
                            @trigger-remove-tag="removeTagFromCharacterMove"
                            :addTagInputActive="addTagActive"
                            :moveName="move.name"
                            :moveId="move.id"
                            :inputs="move.inputs" 
                            :tags="move.tags"
                            :editTagsActive="characterMoveEditTagsActive"
                            class="border rounded p-2"
                        />
                    </div>
                    <div class="flex flex-row justify-end">
                        <button v-if="characterMoveOptionsActive.includes(move.id)" @click="toggleEditTagsMode(move.id)">
                            <span v-if="characterMoveEditTagsActive.includes(move.id)" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                            <span v-else class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Edit Tags</span>
                        </button>
                        <CloseIcon v-if="characterMoveOptionsActive.includes(move.id)" class="h-10 w-10" aria-labelledby="Close move options" @click="toggleMoveOptions(move.id, $event)" />
                        <EllipsisIcon v-else class="h-10 w-10" aria-labelledby="Open move options" @click="toggleMoveOptions(move.id, $event)" />
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="">
    
</style>