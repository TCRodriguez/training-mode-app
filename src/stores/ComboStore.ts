import { defineStore } from 'pinia';
import { useGameStore } from './GameStore';
import { useAuthStore } from './AuthStore';
import { useCharacterStore } from './CharacterStore';
// import { addNotationToNotationDisplay } from '@/common/helpers';
import trainingModeAPI from '../axios-http';
import { directionalInputSets } from '@/common/utilities';
import type { cannedDirectionalInputSetShorthand } from '@/common/utilities';

export const useComboStore = defineStore('ComboStore', {
    state: () => ({
        combos: [],
        combo: {},

        characterComboListDisplay: [],

        comboInputsDisplay: [],

        notationsDisplay: [],
        notationSegments: [],

        searchByTagsList: [],

        characterComboSearchByTextValue: '',
        characterComboSearchByTagsValue: '',

        characterComboNotes: [],
        characterComboNoteListDisplay: [],

        characterComboNoteSearchByTextInputValue: '',
        characterComboNoteSearchByTagInputValue: '',
        
        characterComboNoteTagsListDisplay: [],
        characterComboNotesTags: [],
        characterComboNotesFilteredByTagsList: [],
        characterComboNoteSearchByTagsList: [],
        newCharacterComboTagLoading: false,
        newCharacterComboNoteTagLoading: false,
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
        async addCannedDirectionalInputsToDisplay(set: cannedDirectionalInputSetShorthand) {
            const gameStore = useGameStore();
            const directionalInputs = gameStore.getDirectionalInputTaps;

            // directionalInputSets[set].forEach(direction => {
            //     let directionalInput = directionalInputs.find(input => input.direction === direction);
            //     inputsToAdd.push(directionalInput);
            // });
            // console.log(inputsToAdd);
            directionalInputSets[set].directions.forEach(direction => {
                console.log(direction);
                let directionalInput = directionalInputs.find(input => input.direction === direction);
                directionalInput.category = 'directional-inputs';
                console.log(directionalInput);
                this.comboInputsDisplay.push(directionalInput);
            });

            // TODO: Do we need to add that `this.notationsDisplay` line here? Or is that some older code that we don't use anymore?
            // TODO: I think it was meant to be part of the "toggle notations view" feature, but I'm not sure.
            // TODO: THis is where you'd see it go from icoons to `d, df, f` or whatever.
            // TODO: Did we end up accomplishing that in another way?

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
        async saveCharacterCombo(comboName:string, gameId: string, characterId: string, comboInputs: object) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.post(`/games/${gameId}/characters/${characterId}/character-combos`, {
                    name: comboName,
                    game_id: gameId,
                    character_id: characterId,
                    inputs: comboInputs
                })
                .then(response => {
                    this.fetchCharacterCombos(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterCombo(comboName:string, gameId: string, characterId: string, comboId: string, comboInputs: object) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.put(`/games/${gameId}/characters/${characterId}/character-combos/${comboId}`, {
                    name: comboName,
                    game_id: gameId,
                    character_id: characterId,
                    inputs: comboInputs
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

            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/characters/${characterId}/character-combos`);
                this.combos = data.data;
                this.updateCharacterComboListDisplay('text');

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
                        const notationModel = gameStore.gameNotations.find(notation => {
                            return notation.notation === input.notation;
                        });

                        if(notationModel?.character_id !== null) {
                            input.category = "character-notations";
                        } else {
                            input.category = "notations";
                        }


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
                    this.fetchCharacterCombos(gameId, characterId)
                    .then(() => {
                        this.newCharacterComboTagLoading = false;
                    })
                })

            } catch (error) {
                console.log(error);
            }
        },
        async updateNewCharacterComboTagLoadingState() {
            this.newCharacterComboTagLoading = !this.newCharacterComboTagLoading;
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

            // Tag only gets added if it exists.
            if(!this.searchByTagsList.includes(tag) && tagExists) {
                this.searchByTagsList.push(tag);
            }
        },

        async removeCharacterComboTagFromSearchList(tag: string) {
            this.searchByTagsList.splice(this.searchByTagsList.indexOf(tag), 1);
        },
        async clearCharacterComboTagSearchList() {
            this.searchByTagsList = [];
            this.characterComboListDisplay = [...this.combos];
        },
        async updateCharacterComboListDisplay(searchBy: 'text' | 'tags') {


            if(searchBy === 'text') {
                if(this.characterComboSearchByTextValue.length === 0) {
                    this.resetCharacterComboListDisplay();
                    return;
                }
                console.log(this.characterComboSearchByTextValue);
                this.characterComboListDisplay = this.combos.filter(combo => {
                    if(combo.name === null) {
                        return;
                    }
                    return combo.name.toLowerCase().includes(this.characterComboSearchByTextValue.toLowerCase());
                })

            } else if (searchBy === 'tags') {

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
            }
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
            localStorage.setItem('characterComboId', this.combo.id);
            this.updateCharacterComboNoteListDisplay();
        },



        async fetchCharacterComboNotes(gameId: string, characterId: string, comboId: number) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.get(`/games/${gameId}/characters/${characterId}/combos/${comboId}/notes`)
                .then(response => {
                    this.characterComboNotes = [...response.data];
                    this.characterComboNotes.forEach(note => {
                        note.tags.forEach(tag => {
                            if(! this.characterComboNotesTags.find(characterComboNoteTag => characterComboNoteTag.name === tag.name )) {
                                this.characterComboNotesTags.push(tag);

                            }
                        })
                    });
                    this.updateCharacterComboNoteListDisplay();
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterComboNote(gameId: string, characterId: string, comboId: number, note: object) {
            const authStore = useAuthStore();
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
        async deleteCharacterComboNote(gameId: string, characterId: string, comboId: number, noteId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/characters/${characterId}/combos/${comboId}/notes/${noteId}`, {
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

        async updateCharacterComboNoteSearchByTextCriteria(input: string) {
            this.characterComboNoteSearchByTextInputValue = input;
        },
        async updateCharacterComboNoteListDisplay(criteria?: 'text' | 'tags') {
            let characterComboNoteListFilteredByTags: object[] = [];

            // TODO Add an `if` here for if `criteria` is 'text'?
            if(this.characterComboNoteSearchByTextInputValue.length === 0) {
                this.characterComboNoteListDisplay = [...this.characterComboNotes];
            } else {
                // TODO This will change once we remove note titles
                this.characterComboNoteListDisplay = this.characterComboNotes.filter(characterComboNote => characterComboNote.title.toLowerCase().includes(this.characterComboNoteSearchByTextInputValue.toLowerCase()))
            }

            if(criteria === 'tags') {
                if(this.characterComboNoteSearchByTagInputValue.length === 0) {
                    this.resetCharacterComboNoteListDisplay();
                    return;
                }

                this.characterComboNotes.forEach(note => {
                    note.tags.forEach(tag => {
                        if(this.characterComboNoteSearchByTagsList.includes(tag.name)) {
                            characterComboNoteListFilteredByTags.push(note);
                        }
                    })
                })
                
                this.characterComboNoteListDisplay = [...characterComboNoteListFilteredByTags];
            }

            
        },
        async updateSearchCharacterComboNoteByTagsCriteria(input: string) {
            this.characterComboNoteSearchByTagInputValue = input;
        },

        async resetCharacterComboNoteListDisplay() {
            this.characterComboNoteListDisplay = [...this.characterComboNotes];
        },


        async removeCharacterComboNoteTagFromSearchList(tag: object) {
            this.characterComboNoteSearchByTagsList.splice(this.characterComboNoteSearchByTagsList.indexOf(tag), 1);
        },

        async updateCharacterComboNoteTagsListDisplay() {
            if(this.characterComboNoteSearchByTagInputValue.length === 0) {
                this.characterComboNoteTagsListDisplay = [];
                return;
            }
            this.characterComboNoteTagsListDisplay = this.characterComboNotesTags.filter(tag => {
                return tag.name.includes(this.characterComboNoteSearchByTagInputValue);
            })
        },
        async addCharacterComboNoteTagToSearchList(tag: string) {
            const gameStore = useGameStore();

            const tagNamesArray = gameStore.tags.map(tag => tag.name);
            const tagExists = tagNamesArray.includes(tag);

            if(!this.characterComboNoteSearchByTagsList.includes(tag) && tagExists) {
                this.characterComboNoteSearchByTagsList.push(tag);
                this.updateCharacterComboNoteListDisplay('tags');
            }
        },

        async addTagToCharacterComboNote(gameId: number, characterId: number, characterComboNoteId: string, newTag: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            try {
                await trainingModeAPI.post(`/games/${gameId}/notes/${characterComboNoteId}/tags`, {
                    tags: [newTag]
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    gameStore.fetchTags(gameId);
                    this.fetchCharacterCombos(gameId, characterId);
                    this.fetchCharacterComboNotes(gameId, characterId, this.combo.id)
                    
                    .then(() => {
                        this.updateNewComboNoteTagLoadingState();
                    })
                })

            } catch (error) {
                console.log(error);
            }
        },
        async removeTagFromCharacterComboNote(gameId: string, characterComboNoteId: number, tagId: number) {
            const authStore = useAuthStore();
            const characterStore = useCharacterStore();
            try {
                await trainingModeAPI.delete(`/games/${gameId}/notes/${characterComboNoteId}/tags/${tagId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    this.fetchCharacterComboNotes(gameId, characterStore.character.id, this.combo.id);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async updateCharacterComboSearchByTextCriteria(input: string) {
            this.characterComboSearchByTextValue = input;
        },
        async updateCharacterComboSearchByTagsCriteria(input: string) {
            this.characterComboSearchByTagsValue = input;
        },
        async updateNewComboNoteTagLoadingState() {
            console.log('updateNewComboNoteTagLoadingState hit');
            this.newCharacterComboNoteTagLoading = !this.newCharacterComboNoteTagLoading;
        }
    }
});
