import { defineStore } from 'pinia';
import { useAuthStore } from './AuthStore';
import { useGameStore } from './GameStore';
import trainingModeAPI from '../axios-http';
import { getPinnedResources } from '../common/helpers';

export const useCharacterStore = defineStore('CharacterStore', {
    state: () => ({
        characters: [],
        characterListLoading: true,
        pinnedCharacters: getPinnedResources('characters'),
        character: {},

        characterListDisplay: [],

        characterNotes: [],
        characterNoteListDisplay: [],
        characterNoteSearchByTextInputValue: '', // ? Do we still need this?

        characterNoteSearchByTagInputValue: '',
        characterNoteTagsListDisplay: [],
        characterNotesTags: [],
        characterNotesFilteredByTagsList: [],
        characterNoteSearchByTagsList: [],
        newCharacterNoteTagLoadingState: false,

        characterSearchInputValue: '',

        characterNotations: [],
    }),
    getters: {
        getCharacter(state) {
            return state.character;
        },
        // getCharacterName(state) {
        //     return state.character.name;
        // },
        // getAlphabeticalCharacterListDisplay(state) {
        //     return state.characterListDisplay.sort((a: any, b: any) => {
        //         return a.name.localeCompare(b.name);
        //     });
        // }
        getAlphabeticalCharacterListDisplay(state) {
            // Assuming getPinnedResources returns an array of pinned character names for simplicity
            // const pinnedCharacterIds = getPinnedResources('characters');
          
            // Split the character list into pinned and unpinned arrays
            const pinnedCharacters = state.characterListDisplay.filter(character => this.pinnedCharacters?.includes(character.id));
            const unpinnedCharacters = state.characterListDisplay.filter(character => !this.pinnedCharacters?.includes(character.id));
          
            // Sort both arrays alphabetically
            const sortedPinnedCharacters = pinnedCharacters.sort((a, b) => a.name.localeCompare(b.name));
            const sortedUnpinnedCharacters = unpinnedCharacters.sort((a, b) => a.name.localeCompare(b.name));
          
            // Concatenate the sorted pinned characters with the sorted unpinned characters
            return [...sortedPinnedCharacters, ...sortedUnpinnedCharacters];
          }
    },
    actions: {
        async fetchCharacters(gameId: any) {
            const authStore = useAuthStore();
            const endpoint = authStore.loggedInUser === null ? `/games/${gameId}/characters/guest` : `/games/${gameId}/characters`;

            try {
                const data = await trainingModeAPI.get(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.characters = response.data;
                    this.characterListDisplay = response.data;
                    this.characterListLoading = false;
                })
            }
            catch(error) {
                console.log(error);
            }
        },
        async setCharacter(characterId: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            const gameId = localStorage.getItem('gameId') === null ? gameStore.game.id : localStorage.getItem('gameId');

            this.character = this.characters.find(character => character.id == characterId);
            if(authStore.loggedInUser !== null) {
                this.fetchCharacterNotes(gameId, characterId);
                if(this.character.notes !== undefined) {
                    this.characterNoteListDisplay = [...this.character.notes];
                }
            }
            this.characterNotations = this.character !== undefined ? this.character.notations : [];
            this.characterSearchInputValue = '';
            if(this.character) {
                localStorage.setItem('character', `${this.character.name}`);
                localStorage.setItem('characterId', `${this.character.id}`);
            }
        },
        async fetchCharacterNotes(gameId: string, characterId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.get(`/games/${gameId}/characters/${characterId}/notes`)
                .then(response => {
                    this.characterNotes = [...response.data];
                    this.characterNotes.forEach(note => {
                        note.tags.forEach(tag => {
                            if(! this.characterNotesTags.find(characterNoteTag => characterNoteTag.name === tag.name )) {
                                this.characterNotesTags.push(tag);

                            }
                        })
                    });
                    this.updateCharacterNoteListDisplay();
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterSearchCriteria(input: string) {
            this.characterSearchInputValue = input;
        },
        async updateCharacterNoteSearchByTextCriteria(input: string) {
            this.characterNoteSearchByTextInputValue = input;
        },
        async updateSearchCharacterNoteByTagsCriteria(input: string) {
            this.characterNoteSearchByTagInputValue = input;
        },

        async updateCharacterListDisplay() {
            if(this.characterSearchInputValue.length === 0) {
                this.characterListDisplay = [...this.characters];
            } else {
                this.characterListDisplay = this.characters.filter(character => character.name.toLowerCase().includes(this.characterSearchInputValue.toLowerCase()))
            }
        },
        
        async resetCharacterNoteListDisplay() {
            this.characterNoteListDisplay = [...this.characterNotes];
        },
        async updateCharacterNoteListDisplay(criteria?: 'text' | 'tags') {
            let characterNoteListFilteredByTags: object[] = [];

            // TODO Add an `if` here for if `criteria` is 'text'?
            if(this.characterNoteSearchByTextInputValue.length === 0) {
                this.characterNoteListDisplay = [...this.characterNotes];
            } else {
                // TODO This will change once we remove note titles
                this.characterNoteListDisplay = this.characterNotes.filter(characterNote => characterNote.title.toLowerCase().includes(this.characterNoteSearchByTextInputValue.toLowerCase()))
            }

            if(criteria === 'tags') {
                if(this.characterNoteSearchByTagInputValue.length === 0) {
                    this.resetCharacterNoteListDisplay();
                    return;
                }

                this.characterNotes.forEach(note => {
                    note.tags.forEach(tag => {
                        if(this.characterNoteSearchByTagsList.includes(tag.name)) {
                            characterNoteListFilteredByTags.push(note);
                        }
                    })
                })
                
                this.characterNoteListDisplay = [...characterNoteListFilteredByTags];
            }

            
        },
        async saveCharacterNote(gameId: string, characterId: string, note: object) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.post(`/games/${gameId}/characters/${characterId}/notes`, {
                    'title': note.title,
                    'body': note.body
                    }, {
                        headers: {
                            'Authorization': `Bearer ${authStore.token}`
                        }
                    })
                .then(response => {
                    this.fetchCharacterNotes(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterNote(gameId: string, characterId: string, note: object) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.put(`games/${gameId}/characters/${characterId}/notes/${note.id}`, {
                    'title': note.title,
                    'body': note.body
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterNotes(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCharacterNote(gameId: string, characterId: string, noteId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/characters/${characterId}/notes/${noteId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterNotes(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },


        async removeCharacterNoteTagFromSearchList(tag: object) {
            this.characterNoteSearchByTagsList.splice(this.characterNoteSearchByTagsList.indexOf(tag), 1);
        },

        async updateCharacterNoteTagsListDisplay() {
            if(this.characterNoteSearchByTagInputValue.length === 0) {
                this.characterNoteTagsListDisplay = [];
                return;
            }
            this.characterNoteTagsListDisplay = this.characterNotesTags.filter(tag => {
                return tag.name.includes(this.characterNoteSearchByTagInputValue.toLowerCase());
            })
        },
        async addCharacterNoteTagToSearchList(tag: string) {
            const gameStore = useGameStore();

            const tagNamesArray = gameStore.tags.map(tag => tag.name);
            const tagExists = tagNamesArray.includes(tag);

            if(!this.characterNoteSearchByTagsList.includes(tag) && tagExists) {
                this.characterNoteSearchByTagsList.push(tag);
                this.updateCharacterNoteListDisplay('tags');
            }
        },

        async addTagToCharacterNote(gameId: number, characterId: number, characterNoteId: string, newTag: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            try {
                await trainingModeAPI.post(`/games/${gameId}/notes/${characterNoteId}/tags`, {
                    tags: [newTag]
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    gameStore.fetchTags(gameId);
                    this.fetchCharacterNotes(gameId, characterId)
                    .then(() => {
                        this.updateNewCharacterNoteTagLoadingState();
                    })
                })

            } catch (error) {
                console.log(error);
            }
        },

        async removeTagFromCharacterNote(gameId: string, characterNoteId: number, tagId: number) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/notes/${characterNoteId}/tags/${tagId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterNotes(gameId, this.character.id);
                })
            } catch (error) {
                console.log(error);
            }
        },

        async updateNewCharacterNoteTagLoadingState() {
            this.newCharacterNoteTagLoadingState = !this.newCharacterNoteTagLoadingState;
        },
        async updatePinnedCharacters(pinnedCharacters) {
            this.pinnedCharacters = pinnedCharacters;
        }
    }
})