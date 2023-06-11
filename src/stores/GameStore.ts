import { defineStore } from 'pinia';
import { useAuthStore } from './AuthStore';
import trainingModeAPI from '../axios-http';

export const useGameStore = defineStore('GameStore', {
    state: () => ({
        games: [],
        game: {},

        gameNotes: [],
        gameNoteListDisplay: [],
        gameNoteSearchInputValue: '',

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

        tags: [],
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
            // ! Need to remove this hardcoded list here
            const attackButtonSinglesNotations = ['1', '2', '3', '4']
            const attackButtonSinglesArray: any[] = [];

            state.attackButtons.forEach(attackButton => {
                
                // if(attackButton.notations[0] !== undefined && attackButtonSinglesNotations.includes(attackButton.notations[0].notation)) {
                //     attackButtonSinglesArray.push(attackButton)
                // }
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
            // Get input that matches provided notation
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
                // this.directionalInputs.forEach(input => {
                //     input.notation = this.directionalInputNotations.find(notation => )
                // })
                this.directionalInputs.forEach(input => {
                    input.notations.forEach(notation => {
                        if(notation.game_id === this.game.id) {
                            input.notation = notation.notation
                        }
                    })
                    input.icons.forEach(icon => {
                        if(icon.game_id === this.game.id) {
                            input.icon_file_name = icon.icon_file_name;
                        }
                    })
                })
                
            } catch (error) {
                
            }
        },
        async fetchGames() {
            try {
                const data = await trainingModeAPI.get('/games')
                
                this.games = [...data.data];
            }
            catch(error) {
                
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
                    
                    this.gameNotes = [...response.data]
                    // this.characterNoteListDisplay = response.data;
                    // this.setCharacter(characterId);
                    this.updateGameNoteListDisplay();
                })
            } catch (error) {
                
            }
        },
        async fetchGameNotations(gameId: string) {
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/game-notations`)
                this.gameNotations = data.data.filter(notation => notation.notations_group === 'other');
                this.directionalInputNotations = data.data.filter(notation => notation.notations_group === 'directions');
                this.attackButtonNotations = data.data.filter(notation => notation.notations_group === 'attacks')
                // 
                
            } catch (error) {
                
            }
        },
        async fetchAttackButtons(gameId: string) {
            
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/attack-buttons`)
                this.attackButtons = data.data
                
                this.attackButtons.forEach(input => {
                    input.notations.forEach(notation => {
                        if(notation.game_id === this.game.id) {
                            input.notation = notation.notation
                        }
                    })
                    input.icons.forEach(icon => {
                        if(icon.game_id === this.game.id) {
                            input.icon_file_name = icon.icon_file_name;
                        }
                    })
                })

            } catch(error) {
                
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
                // .then(() => {
                //     this.tags = data.data;
                //     
                // })
                this.tags = data.data;
                
            } catch (error) {
                console.log(error);
            }
        },
        async setGame(gameId: string) {
            this.game = this.games.find(game => game.id === gameId);
            this.game.bread_crumb_type = 'game';
            this.gameNoteListDisplay = [...this.game.notes];
            
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
                    // this.fetchCharacters(gameId);

                    // this.characterNoteListDisplay = [...this.character.notes]
                })
            } catch (error) {
                
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
                
            }
        },





        async updateGameNoteListDisplay() {
            // this.setCharacter(this.character.id);
            if(this.gameNoteSearchInputValue.length === 0) {
                this.gameNoteListDisplay = [...this.gameNotes];
            } else {
                this.gameNoteListDisplay = this.game.notes.filter(gameNote => gameNote.title.toLowerCase().includes(this.gameNoteSearchInputValue.toLowerCase()))

            }
        },        
        async updateTagsListDisplay() {
            this.tagsListDisplay = this.tags.filter(tag => {
                // 
                return tag.name.includes(this.tagSearchCriteria);
            })
            
        },
        async updateTagSearchCriteria(input: string) {
            this.tagSearchCriteria = input;
            
        }
    }
});