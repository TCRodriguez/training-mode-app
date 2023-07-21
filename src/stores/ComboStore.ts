import { defineStore } from 'pinia';
import { useGameStore } from './GameStore';
import { useAuthStore } from './AuthStore';
// import { addNotationToNotationDisplay } from '@/common/helpers';
import trainingModeAPI from '../axios-http';

export const useComboStore = defineStore('ComboStore', {
    state: () => ({
        combos: [],
        combo: {},

        characterComboListDisplay: [],

        comboInputsDisplay: [],

        notationsDisplay: [],
        notationSegments: [],

        searchByTagsList: [],

        characterComboNotes: [],
        characterComboNoteListDisplay: [],
        characterComboNoteSearchInputValue: '',
    }),
    getters: {
        getCombos(state) {
            return state.combos;
        },
        getCharacterComboTags(state) {
            return function (comboId: string) {
                let characterCombo = state.characterComboListDisplay.find(combo => combo.id === comboId);
                let tags = [...characterCombo?.tags];
                return tags;
            }
        },
        getCharacterComboNotes(state) {
            return function (comboId: number) {
                let characterCombo = state.characterComboListDisplay.find(combo => combo.id === comboId);
                let notes = [...characterCombo?.notes];
                return notes;
            }
        }
    },
    actions: {
        async addDirectionalInputToDisplay(directionalInput: object) {
            directionalInput.category = 'directional-inputs';
            this.comboInputsDisplay.push(directionalInput)

            this.notationsDisplay.push({
                notation: directionalInput.notations[0].notation,
                category: 'directional-inputs',
                icon_file_name: directionalInput.icons[0].icon_file_name
            });
        },
        async addAttackButtonInputToDisplay(attackButtonInput: object) {
            attackButtonInput.category = 'attack-buttons';
            this.comboInputsDisplay.push(attackButtonInput);

            this.notationsDisplay.push({
                notation: attackButtonInput.notations[0].notation,
                category: 'attack-buttons',
                icon_file_name: attackButtonInput.icon_file_name
            });
        },
        async addNotationToDisplay(notation) {
            if(notation.character_id !== null) {
                notation.category = 'character-notations';
            } else {
                notation.category = 'notations'
            }

            this.comboInputsDisplay.push(notation);
            this.notationsDisplay.push({
                notation: notation.notation,
                category: 'other',
                icon_file_name: notation.icon_file_name
            });
        },
        async addNotationSegments(notationSegments) {
            this.notationSegments.push(notationSegments);
        },
        async eraseComboInput() {
            this.comboInputsDisplay.pop();
            this.notationsDisplay.pop();
        },
        async clearComboInputsDisplay() {
            this.comboInputsDisplay = [];
            this.notationsDisplay = [];
        },
        async clearNotationSegments() {
            this.notationSegments = [];
        },
        async saveCharacterCombo(gameId: string, characterId: string, comboInputs: object) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.post(`/games/${gameId}/characters/${characterId}/character-combos`, {
                    game_id: gameId,
                    character_id: characterId,
                    inputs: comboInputs
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterCombos(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterCombo(gameId: string, characterId: string, comboId: string, comboInputs: object) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.put(`/games/${gameId}/characters/${characterId}/character-combos/${comboId}`, {
                    game_id: gameId,
                    character_id: characterId,
                    inputs: comboInputs
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.clearComboInputsDisplay();
                    this.fetchCharacterCombos(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCharacterCombo(gameId: string, characterId: string, comboId: number,) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/characters/${characterId}/character-combos/${comboId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterCombos(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async fetchCharacterCombos(gameId: string, characterId: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();

            if(authStore.loggedInUser === null) {
                return;
            }
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/characters/${characterId}/character-combos`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                });
                this.combos = data.data;
                // console.log(data);
                this.updateCharacterComboListDisplay();
                // this.characterComboNotes = data.data

                for (let i = 0; i < this.combos.length; i++) {
                    const combo = this.combos[i];
                    const comboInputs = [];
                    let comboInputsSorted = [];

                    combo.directional_inputs.forEach(input => {
                        const directionalInputModel = gameStore.directionalInputs.find(directionalInput => {
                            return directionalInput.direction === input.direction;
                        });
                        const iconFileName = directionalInputModel?.icon_file_name;
    
                        const directionalInputObject = {
                            ...input,
                            category: "directional-inputs",
                            img_category: "directional-inputs",
                            icon_file_name: iconFileName,
                            
                        }
                        comboInputs.push(directionalInputObject);
                    })
    
                    combo.attack_buttons.forEach(input => {
                        const attackButtonModel = gameStore.attackButtons.find(attackButton => {
                            return attackButton.name === input.name;
                        }); 
                        const iconFileName = attackButtonModel?.icon_file_name;
                        const attackButtonObject = {
                            ...input,
                            category: "attack-buttons",
                            img_category: "attack-buttons",
                            icon_file_name: iconFileName,
                            
                        }
                        comboInputs.push(attackButtonObject);
                    });
    
                    combo.notations.forEach(input => {
                        input.input_category = "notations";
                        input.img_category = "notations"
                        comboInputs.push(input);
                    });
    
                    comboInputs.forEach(input => {
                        input.order_in_combo = input.pivot.order_in_combo;
                    });
                        
                    comboInputsSorted = comboInputs.sort((a, b) => a.order_in_combo - b.order_in_combo);
    
                    combo.inputs = [...comboInputsSorted];
                }
            } catch (error) {
                console.log(error);
            }
        },
        async addTagToCharacterCombo(gameId: string, characterId:string, characterComboId:string, newTag: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            try {
                await trainingModeAPI.post(`/games/${gameId}/characters/${characterId}/combos/${characterComboId}/tags`, {
                    tags: [newTag]
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    gameStore.fetchTags(gameId);
                    this.fetchCharacterCombos(gameId, characterId);
                })

            } catch (error) {
                console.log(error);
            }
        },
        async removeTagFromCharacterCombo(gameId: string, characterId: string, comboId: string, tagId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/characters/${characterId}/combos/${comboId}/tags/${tagId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterCombos(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async addCharacterComboTagToSearchList(tag: string) {
            const gameStore = useGameStore();

            const tagNamesArray = gameStore.tags.map(tag => tag.name);
            const tagExists = tagNamesArray.includes(tag);

            if(!this.searchByTagsList.includes(tag) && tagExists) {
                this.searchByTagsList.push(tag);
            }
        },

        async removeCharacterComboTagFromSearchList(tag: string) {
            this.searchByTagsList.splice(this.searchByTagsList.indexOf(tag), 1);
        },
        async updateCharacterComboListDisplay() {
            let characterComboListFilteredByTags: object[] = [];

            if(this.searchByTagsList.length === 0) {
                this.resetCharacterComboListDisplay();
                return;
            }

            this.combos.forEach(combo => {
                combo.tags.forEach(tag => {
                    if(this.searchByTagsList.includes(tag.name)) {
                        characterComboListFilteredByTags.push(combo);
                    }
                })
            })
            this.characterComboListDisplay = [...characterComboListFilteredByTags];
        },
        async resetCharacterComboListDisplay() {
            this.characterComboListDisplay = [...this.combos];
        },
        async populateComboInputsDisplay(inputs: object[]) {
            this.comboInputsDisplay = [...inputs];
        },
        async saveCharacterComboNote(gameId: string, characterId: string, comboId: number, note: { title: string, body: string }) {
            const authStore = useAuthStore();
            
            try {
                await trainingModeAPI.post(`/games/${gameId}/characters/${characterId}/combos/${comboId}/notes`, {
                    'title': note.title,
                    'body': note.body
                    }, {
                        headers: {
                            'Authorization': `Bearer ${authStore.token}`
                        }
                    })
                .then(response => {
                    this.fetchCharacterComboNotes(gameId, characterId, comboId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async setCharacterCombo(comboId: number) {
            this.combo = this.combos.find(combo => combo.id === comboId);
            this.characterComboNotes = [...this.combo.notes];
            this.updateCharacterComboNoteListDisplay();
        },
        async fetchCharacterComboNotes(gameId: string, characterId: string, comboId: number) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.get(`/games/${gameId}/characters/${characterId}/combos/${comboId}/notes`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.characterComboNotes = [...response.data]
                    this.updateCharacterComboNoteListDisplay();
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterComboNote(gameId: string, characterId: string, comboId: number, note: object) {
            const authStore = useAuthStore();
            console.log(note);
            try {
                await trainingModeAPI.put(`games/${gameId}/characters/${characterId}/combos/${comboId}/notes/${note.id}`, {
                    'title': note.title,
                    'body': note.body
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterComboNotes(gameId, characterId, comboId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterComboNoteListDisplay() {
            if(this.characterComboNoteSearchInputValue.length === 0) {
                this.characterComboNoteListDisplay = [...this.characterComboNotes];
                console.log(this.characterComboNoteListDisplay);
            } else {
                this.characterComboNoteListDisplay = this.combo.notes.filter(characterComboNote => characterComboNote.title.toLowerCase().includes(this.characterComboNoteSearchInputValue.toLowerCase()));
            }
        },

    }
});
