import { defineStore } from 'pinia';
import { useAuthStore } from './AuthStore';
import trainingModeAPI from '../axios-http';

export const useGameStore = defineStore('GameStore', {
    state: () => ({
        games: [],
        game: {},

        gameNotes: [],
        gameNoteListDisplay: [],
        gameNoteSearchByTextInputValue: '', // ? Do we still need this?

        gameNoteSearchByTagInputValue: '',
        gameNoteTagsListDisplay: [],
        gameNotesTags: [],
        gameNotesFilteredByTagsList: [],
        gameNoteSearchByTagsList: [],

        comingSoonList: [
            'Tekken 7',
        ],
        gameNotations: [],

        directionalInputs: [],
        directionalInputIconLinks: [],
        directionalInputNotations: [],

        attackButtons: [],
        attackButtonNotations: [],
        attackButtonIconLinks: [],

        tags: [], // Entire list of tags for game
        tagsListDisplay: [],
        tagSearchCriteria: '',

    }),
    getters: {
        getGame(state): object | undefined {
            return state.game;
        },
        getGameTitle(state): string {
            return state.game.title;
        },
        findGame: (state) => {
            return (gameId: string) => {
                const game = state.games.find(game => game.id == gameId);
                return game;
            }
        },
        getGames(state){
            return state.games;
        },
        getAttackButtons: (state) => state.attackButtons,
        getAttackButtonSingles: (state) => {
            const attackButtonSinglesNotations = ['1', '2', '3', '4']
            const attackButtonSinglesArray: any[] = [];

            state.attackButtons.forEach(attackButton => {
                
                if(attackButton.button_count === "1") {
                    attackButtonSinglesArray.push(attackButton)
                }
            });

            return attackButtonSinglesArray;
        },
        getAttackButtonDoubles: (state) => {
            const attackButtonDoublesNotations = [
                '1 + 2',
                '1 + 3',
                '1 + 4',
                '2 + 3',
                '2 + 4',
                '3 + 4',
            ]
            const attackButtonDoublesArray: any[] = [];

            state.attackButtons.forEach(attackButton => {
                if(attackButton.notations[0] !== undefined && attackButtonDoublesNotations.includes(attackButton.notations[0].notation)) {
                    attackButtonDoublesArray.push(attackButton)
                }
            });

            return attackButtonDoublesArray;
        },
        getAttackButtonTriples: (state) => {
            const attackButtonTriplesNotations = [
                '1 + 2 + 3',
                '1 + 2 + 4',
                '1 + 3 + 4',
                '2 + 3 + 4',
                '1 + 2 + 3 + 4'
            ]
            const attackButtonTriplesArray: any[] = [];

            state.attackButtons.forEach(attackButton => {
                if(attackButton.notations[0] !== undefined) {
                    attackButtonTriplesNotations.forEach(notation => {
                        if(notation === attackButton.notations[0].notation) {
                            attackButtonTriplesArray.push(attackButton)
                        }
                    })
                }
            });

            return attackButtonTriplesArray;
        },
        getDirectionalInputTaps(state) {
            const inputs = state.directionalInputs.filter(input => !input.direction.includes('(hold)'));
            
            return inputs;
        },
        getDirectionalInputHolds(state) {
            const inputs = state.directionalInputs.filter(input => input.direction.includes('(hold)'));

            return inputs;
        },
        getDirectionalInputNotations(state) {
            const directionalInputNotations = state.gameNotations.filter(notation => notation.notations_group === 'directions');

            return directionalInputNotations;
        },
        getGameNotations(state) {
            const gameNotations = state.gameNotations.filter(notation => notation.notations_group === 'other');
            
            return gameNotations;
        },
        getInput(state) {
            return (inputNotation: string, inputCategory: string) => {
                
                let result;
                switch (inputCategory) {
                    case 'directional-inputs':
                        result = state.directionalInputs.find((directionalInput) => directionalInput.notations[0].notation === inputNotation); 
                        
                        break;
                    case 'attack-buttons':
                        result = state.attackButtons.find((attackButton) => attackButton.notations[0].notation === inputNotation); 
                        
                        break;
                    case 'notations':
                        result = state.gameNotations.find((gameNotation) => gameNotation.notations[0].notation === inputNotation); 
                        break;
                    default:
                        break;
                }
            }
        }

    },
    actions: {
        async fetchDirectionalInputs() {
            try {
                const data = await trainingModeAPI.get('/directional-inputs');
                this.directionalInputs = data.data;
                this.directionalInputs.forEach(input => {
                    input.notations.forEach(notation => {
                        if(notation.game_id === this.game.id) {
                            input.notation = notation.notation
                        }
                    })
                    input.icons.forEach(icon => {
                        if(icon.game_id === this.game.id) {
                            input.icon_file_name = icon.icon_file_name;
                            localStorage.setItem(`${input.direction}`, `${icon.icon_file_name}`);
                        }
                    })
                })
                
            } catch (error) {
                console.log(error);
            }
        },
        async fetchGames() {
            const authStore = useAuthStore();
            const endpoint = authStore.loggedInUser === null ? `/games/guest` : `/games`;

            try {
                const data = await trainingModeAPI.get(endpoint)
                
                this.games = [...data.data];
            }
            catch(error) {
                console.log(error);
            }
        },
        async fetchGameNotes(gameId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.get(`/games/${gameId}/notes`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.gameNotes = [...response.data];
                    // this.gameNotesTags = [...this.gameNotes.]
                    this.gameNotes.forEach(note => {
                        note.tags.forEach(tag => {
                            if(! this.gameNotesTags.find(gameNoteTag => gameNoteTag.name === tag.name )) {
                                this.gameNotesTags.push(tag);

                            }
                        })
                    });
                    this.updateGameNoteListDisplay();
                })
            } catch (error) {
                console.log(error);
            }
        },
        async fetchGameNotations(gameId: string) {
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/game-notations`)
                this.gameNotations = data.data.filter(notation => notation.notations_group === 'other');
                this.directionalInputNotations = data.data.filter(notation => notation.notations_group === 'directions');
                this.attackButtonNotations = data.data.filter(notation => notation.notations_group === 'attacks')
            } catch (error) {
                console.log(error);
            }
        },
        async fetchAttackButtons(gameId: string) {
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/attack-buttons`)
                this.attackButtons = [...data.data]

                this.attackButtons.forEach(input => {
                    input.notations.forEach(notation => {
                        if(notation.game_id === this.game.id) {
                            input.notation = notation.notation
                        }
                    });

                    localStorage.setItem(`${input.name}`, `${input.icon_file_name}`);
                })
            } catch(error) {
                console.log(error);
            }
        },
        async fetchTags(gameId: string) {
            const authStore = useAuthStore();
            if(authStore.loggedInUser === null) {
                return;
            }
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/tags`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                this.tags = data.data;
            } catch (error) {
                console.log(error);
            }
            
            return this.tags;
        },
        async setGame(gameId: string) {
            this.game = this.games.find(game => game.id == gameId);
            this.game.bread_crumb_type = 'game';
            this.gameNoteListDisplay = [...this.game.notes];
            localStorage.setItem('game', this.game.abbreviation);
            
        },
        async saveGameNote(gameId: string, note: object) {
            const authStore = useAuthStore();
            
            try {
                await trainingModeAPI.post(`/games/${gameId}/notes`, {
                    'title': note.title,
                    'body': note.body
                    }, {
                        headers: {
                            'Authorization': `Bearer ${authStore.token}`
                        }
                    })
                .then(response => {
                    this.fetchGameNotes(gameId);
                })
            } catch (error) {
                console.log(error);
            }
        },

        async updateGameNote(gameId: string, note: object) {
            const authStore = useAuthStore();
            
            try {
                await trainingModeAPI.put(`games/${gameId}/notes/${note.id}`, {
                    'title': note.title,
                    'body': note.body
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchGameNotes(gameId);
                })
            } catch (error) {
                console.log(error);
            }
        },

        async deleteGameNote(gameId: string, noteId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/notes/${noteId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchGameNotes(gameId);
                })
            } catch (error) {
                console.log(error);
            }
        },

        async updateGameNoteListDisplay(criteria?: 'text' | 'tags') {
            let gameNoteListFilteredByTags: object[] = [];

            // TODO Add an `if` here for if `criteria` is 'text'?
            if(this.gameNoteSearchByTextInputValue.length === 0) {
                this.gameNoteListDisplay = [...this.gameNotes];
            } else {
                // TODO This will change once we remove note titles
                this.gameNoteListDisplay = this.gameNotes.filter(gameNote => gameNote.title.toLowerCase().includes(this.gameNoteSearchByTextInputValue.toLowerCase()))
            }

            if(criteria === 'tags') {
                if(this.gameNoteSearchByTagInputValue.length === 0) {
                    this.resetGameNoteListDisplay();
                    return;
                }

                this.gameNotes.forEach(note => {
                    note.tags.forEach(tag => {
                        if(this.gameNoteSearchByTagsList.includes(tag.name)) {
                            gameNoteListFilteredByTags.push(note);
                        }
                    })
                })
                
                this.gameNoteListDisplay = [...gameNoteListFilteredByTags];
            }

            
        },

        async addGameNoteTagToSearchList(tag: string) {
            const gameNoteTagNamesArray = this.gameNotesTags.map(tag => tag.name);
            const gameNoteTagExists = gameNoteTagNamesArray.includes(tag);

            if(this.gameNoteSearchByTagsList.includes(tag) === false && gameNoteTagExists === true) {
                this.gameNoteSearchByTagsList.push(tag);
                this.updateGameNoteListDisplay('tags');
            }
        },
        async removeGameNoteTagFromSearchList(tag: object) {
            this.gameNoteSearchByTagsList.splice(this.gameNoteSearchByTagsList.indexOf(tag), 1);
        },

        async updateTagsListDisplay() {
            this.tagsListDisplay = this.tags.filter(tag => {
                return tag.name.includes(this.tagSearchCriteria);
            })
            
        },
        async updateTagSearchCriteria(input: string) {
            this.tagSearchCriteria = input;
        },
        async resetGameNoteListDisplay() {
            this.gameNoteListDisplay = [...this.gameNotes];
        },
        async updateSearchGameNoteByTextCriteria(input: string) {
            this.gameNoteSearchByTextInputValue = input;
        },

        async updateSearchGameNoteByTagsCriteria(input: string) {
            this.gameNoteSearchByTagInputValue = input;
        },
        async updateGameNoteTagsListDisplay() {
            this.gameNoteTagsListDisplay = this.gameNotesTags.filter(tag => {
                return tag.name.includes(this.gameNoteSearchByTagInputValue);
            })
        },
        async addTagToGameNote(gameId: number, gameNoteId: string, newTag: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            console.log('add tag to move hit');
            try {
                await trainingModeAPI.post(`/games/${gameId}/notes/${gameNoteId}/tags`, {
                    tags: [newTag]
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    console.log('hello?');
                    console.log(response);
                    gameStore.fetchTags(gameId);
                    this.fetchGameNotes(gameId);
                })

            } catch (error) {
                console.log(error);
            }
        },
        async removeTagFromGameNote(gameId: string, gameNoteId: number, tagId: number) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/notes/${gameNoteId}/tags/${tagId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchGameNotes(gameId);
                })
            } catch (error) {
                console.log(error);
            }
        },
    }
});