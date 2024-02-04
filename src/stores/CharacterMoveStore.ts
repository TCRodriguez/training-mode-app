import { defineStore } from 'pinia';
import { useGameStore } from './GameStore';
import { useAuthStore } from './AuthStore';
import trainingModeAPI from '../axios-http';
import { useCharacterStore } from './CharacterStore';

export const useCharacterMoveStore =  defineStore('CharacterMoveStore', {
    state: () => ({
        characterMoves: [],
        characterMove: {},

        characterMoveNotes: [],
        characterMoveNoteListDisplay: [],
        characterMoveNoteSearchInputValue: '', // ? Do we still need this?

        characterMoveNoteSearchByTextInputValue: '', 

        characterMoveNoteSearchByTagInputValue: '',
        characterMoveNoteTagsListDisplay: [],
        characterMoveNotesTags: [],
        characterMoveNotesFilteredByTagsList: [],
        characterMoveNoteSearchByTagsList: [],

        characterMoveListDisplay: [],
        characterMoveListByTagDisplay: [],
        characterMoveNameSearchInputValue: '',
        searchByTagsList: [],
        newCharacterMoveTagLoading: false,
        newCharacterMoveNoteTagLoading: false,
    }),
    getters: {
        getCharacterMoveTags(state) {
            return function (moveId: string) {
                let characterMove = state.characterMoveListDisplay.find(move => move.id === moveId);
                let tags = [];
                if(characterMove?.tags) {
                    tags = [...characterMove?.tags];
                }
                
                return tags;
            }
        }
    },
    actions: {
        async fetchCharacterMoves(gameId: string, characterId: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();

            const endpoint = authStore.loggedInUser === null ? `/games/${gameId}/characters/${characterId}/moves/guest` : `/games/${gameId}/characters/${characterId}/moves`;
            try {
                await trainingModeAPI.get(endpoint)
                .then(response => {
                    this.characterMoves = response.data;
                    this.updateCharacterMovesListDisplay();
                    gameStore.fetchTags(gameId);
                })
            } catch (error) {
                console.log(error);
            }

            for (let i = 0; i < this.characterMoves.length; i++) {
                const move = this.characterMoves[i];
                const moveInputs = [];
                let moveInputsSorted = [];

                move.directional_inputs.forEach(input => {
                    const directionalInputModel = gameStore.directionalInputs.find(directionalInput => {
                        return directionalInput.direction === input.direction;
                    });

                    const iconFileName = directionalInputModel?.icon_file_name;

                    const directionalInputObject = {
                        ...input,
                        input_category: "directions",
                        img_category: "directional-inputs",
                        icon_file_name: iconFileName,
                        
                    }

                    moveInputs.push(directionalInputObject);
                })

                move.attack_buttons.forEach(input => {
                    const attackButtonModel = gameStore.attackButtons.find(attackButton => {
                        return attackButton.name === input.name;
                    }); 
                    
                    const iconFileName = attackButtonModel?.icon_file_name;
                    const attackButtonObject = {
                        ...input,
                        input_category: "attacks",
                        img_category: "attack-buttons",
                        icon_file_name: iconFileName,
                        
                    }
                    moveInputs.push(attackButtonObject);
                });

                move.notations.forEach(input => {
                    input.input_category = "notations";
                    input.img_category = "notations";
                    moveInputs.push(input);
                });

                moveInputs.forEach(input => {
                    input.order_in_move = input.pivot.order_in_move;
                })
                    
                moveInputsSorted = moveInputs.sort((a, b) => a.order_in_move - b.order_in_move);

                move.inputs = [...moveInputsSorted];
            }
        },
        // TODO: Should we remove this?
        async fetchCharacterMoveTags(gameId: string, characterId: string) {
            const authStore = useAuthStore();
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/characters/${characterId}/tags`);
            } catch (error) {
                console.log(error);
            }
        },
        async addTagToCharacterMove(gameId: string, characterId:string, characterMoveId:string, newTag: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            try {
                await trainingModeAPI.post(`/games/${gameId}/characters/${characterId}/moves/${characterMoveId}/tags`, {
                    tags: [newTag]
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    gameStore.fetchTags(gameId);
                    this.fetchCharacterMoves(gameId, characterId)
                    .then(() => {
                        this.newCharacterMoveTagLoading = false;
                    });
                })

            } catch (error) {
                console.log(error);
            }
        },
        async updateNewCharacterMoveTagLoadingState() {
            this.newCharacterMoveTagLoading = !this.newCharacterMoveTagLoading;
        },
        async updateCharacterMoveSearchCriteria(input: string) {
            this.characterMoveNameSearchInputValue = input;
            
        },

        async updateCharacterMovesListDisplay(criteria: string = ''): Promise<void> {
            let characterMoveListFilteredByTags: object[] = [];

            if(this.characterMoveNameSearchInputValue.length === 0) {
                this.characterMoveListDisplay = [...this.characterMoves];
            } else {
                this.characterMoveListDisplay = this.characterMoves.filter(characterMove => characterMove.name.toLowerCase().includes(this.characterMoveNameSearchInputValue.toLowerCase()));
            }

            if(criteria === 'tags') {
                if(this.searchByTagsList.length === 0) {
                    this.resetCharacterMoveListDisplay();
                    return;
                }

                this.characterMoves.forEach(move => {
                    move.tags.forEach(tag => {
                        if(this.searchByTagsList.includes(tag.name)) {
                            characterMoveListFilteredByTags.push(move);
                        }
                    })
                })
                
                this.characterMoveListDisplay = [...characterMoveListFilteredByTags];
            }
        },

        async addCharacterMoveTagToSearchList(tag: string) {
            const gameStore = useGameStore();

            const tagNamesArray = gameStore.tags.map(tag => tag.name);
            const tagExists = tagNamesArray.includes(tag);

            if(!this.searchByTagsList.includes(tag) && tagExists) {
                this.searchByTagsList.push(tag);
            }
        },

        async removeCharacterMoveTagFromSearchList(tag: string) {
            this.searchByTagsList.splice(this.searchByTagsList.indexOf(tag), 1);
        },

        async setCharacterMove(moveId: number) {
            this.characterMove = this.characterMoves.find(move => move.id === moveId);

            if(this.characterMove.notes !== undefined) {
                this.characterMoveNotes = [...this.characterMove.notes];
            } else {
                this.characterMoveNotes = [];
            }

            localStorage.setItem('characterMoveId', this.characterMove.id);
            
            this.updateCharacterMoveNoteListDisplay();
        },

        async saveCharacterMoveNote(gameId: string, characterId: string, moveId: number, note: { title: string, body: string }) {
            const authStore = useAuthStore();
            
            try {
                await trainingModeAPI.post(`/games/${gameId}/characters/${characterId}/moves/${moveId}/notes`, {
                    'title': note.title,
                    'body': note.body
                    }, {
                        headers: {
                            'Authorization': `Bearer ${authStore.token}`
                        }
                    })
                .then(response => {
                    this.fetchCharacterMoveNotes(gameId, characterId, moveId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterMoveNote(gameId: string, characterId: string, moveId: number, note: object) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.put(`games/${gameId}/characters/${characterId}/moves/${moveId}/notes/${note.id}`, {
                    'title': note.title,
                    'body': note.body
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterMoveNotes(gameId, characterId, moveId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCharacterMoveNote(gameId: string, characterId: string, characterMoveId: number, noteId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/characters/${characterId}/moves/${characterMoveId}/notes/${noteId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterMoveNotes(gameId, characterId, characterMoveId);
                })
            } catch (error) {
                console.log(error);
            }
        },

        async fetchCharacterMoveNotes(gameId: string, characterId: string, moveId: number) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.get(`/games/${gameId}/characters/${characterId}/moves/${moveId}/notes`)
                .then(response => {
                    this.characterMoveNotes = [...response.data]
                    this.characterMoveNotes.forEach(note => {
                        note.tags.forEach(tag => {
                            if(! this.characterMoveNotesTags.find(characterMoveNoteTag => characterMoveNoteTag.name === tag.name )) {
                                this.characterMoveNotesTags.push(tag);

                            }
                        })
                    });
                    this.updateCharacterMoveNoteListDisplay();
                })
            } catch (error) {
                console.log(error);
            }
        },

        async updateCharacterMoveNoteListDisplay(criteria?: 'text' | 'tags') {
            let characterMoveNoteListFilteredByTags: object[] = [];

            // TODO Add an `if` here for if `criteria` is 'text'?
            if(this.characterMoveNoteSearchByTextInputValue.length === 0) {
                this.characterMoveNoteListDisplay = [...this.characterMoveNotes];
            } else {
                // TODO This will change once we remove note titles
                this.characterMoveNoteListDisplay = this.characterMoveNotes.filter(characterMoveNote => characterMoveNote.title.toLowerCase().includes(this.characterMoveNoteSearchByTextInputValue.toLowerCase()))
            }

            if(criteria === 'tags') {
                if(this.characterMoveNoteSearchByTagInputValue.length === 0) {
                    this.resetCharacterMoveNoteListDisplay();
                    return;
                }

                this.characterMoveNotes.forEach(note => {
                    note.tags.forEach(tag => {
                        if(this.characterMoveNoteSearchByTagsList.includes(tag.name)) {
                            characterMoveNoteListFilteredByTags.push(note);
                        }
                    })
                })
                
                this.characterMoveNoteListDisplay = [...characterMoveNoteListFilteredByTags];
            }

            
        },
        async updateCharacterMoveNoteSearchByTextCriteria(input: string) {
            this.characterMoveNoteSearchByTextInputValue = input;
        },

        async updateSearchCharacterMoveNoteByTagsCriteria(input: string) {
            this.characterMoveNoteSearchByTagInputValue = input;
        },

        async resetCharacterMoveListDisplay() {
            this.characterMoveListDisplay = [...this.characterMoves];
        },

        async resetCharacterMoveNoteListDisplay() {
            this.characterMoveNoteListDisplay = [...this.characterMoveNotes];
        },

        async removeTagFromCharacterMove(gameId: string, characterId: string, moveId: string, tagId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/characters/${characterId}/moves/${moveId}/tags/${tagId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterMoves(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async removeCharacterMoveNoteTagFromSearchList(tag: object) {
            this.characterMoveNoteSearchByTagsList.splice(this.characterMoveNoteSearchByTagsList.indexOf(tag), 1);
        },

        async updateCharacterMoveNoteTagsListDisplay() {
            if(this.characterMoveNoteSearchByTagInputValue.length === 0) {
                this.characterMoveNoteTagsListDisplay = [];
                return;
            }
            this.characterMoveNoteTagsListDisplay = this.characterMoveNotesTags.filter(tag => {
                return tag.name.includes(this.characterMoveNoteSearchByTagInputValue);
            })
        },
        async addCharacterMoveNoteTagToSearchList(tag: string) {
            const gameStore = useGameStore();

            const tagNamesArray = gameStore.tags.map(tag => tag.name);
            const tagExists = tagNamesArray.includes(tag);

            if(!this.characterMoveNoteSearchByTagsList.includes(tag) && tagExists) {
                this.characterMoveNoteSearchByTagsList.push(tag);
                this.updateCharacterMoveNoteListDisplay('tags');
            }
        },

        async addTagToCharacterMoveNote(gameId: number, characterMoveNoteId: string, newTag: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            const characterStore = useCharacterStore();
            const characterId = characterStore.character.id;

            try {
                await trainingModeAPI.post(`/games/${gameId}/notes/${characterMoveNoteId}/tags`, {
                    tags: [newTag]
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    gameStore.fetchTags(gameId);
                    this.fetchCharacterMoves(gameId, characterId);
                    console.log(characterId);
                    this.fetchCharacterMoveNotes(gameId, characterId, this.characterMove.id)
                    .then(() => {
                        this.updateNewCharacterMoveNoteTagLoadingState();
                    });
                })

            } catch (error) {
                console.log(error);
            }
        },

        async removeTagFromCharacterMoveNote(gameId: string, characterMoveNoteId: number, tagId: number) {
            const authStore = useAuthStore();
            const characterStore = useCharacterStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/notes/${characterMoveNoteId}/tags/${tagId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterMoveNotes(gameId, characterStore.character.id, this.characterMove.id);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateNewCharacterMoveNoteTagLoadingState() {
            this.newCharacterMoveNoteTagLoading = !this.newCharacterMoveNoteTagLoading;
        }
    }
});