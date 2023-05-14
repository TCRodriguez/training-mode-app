import { defineStore } from 'pinia';
import { useGameStore } from './GameStore';
// import { addNotationToNotationDisplay } from '@/common/helpers';
import trainingModeAPI from '../axios-http';

export const useComboStore = defineStore('ComboStore', {
    state: () => ({
        combos: [],
        characterComboListDisplay: [],
        createComboDisplay: [],
        notationsDisplay: [],
        notationSegments: [],
        searchByTagsList: [],
    }),
    getters: {
        getCombos(state) {
            return state.combos;
        },
        getCharacterComboTags(state) {
            return function (comboId: string) {
                let characterCombo = state.characterComboListDisplay.find(combo => combo.id === comboId);
                let tags = [...characterCombo?.tags];
                console.log(tags);
                // return state.characterMoves.
                return tags;
            }
        }
    },
    actions: {
        async addDirectionalInputToDisplay(directionalInput: object) {
            directionalInput.category = 'directional-inputs';
            this.createComboDisplay.push(directionalInput)
            // this.notationsDisplay.push(directionalInput.)
            console.log(this.createComboDisplay);

            // this.notationsDisplay.push(directionalInput.notations[0].notation)
            this.notationsDisplay.push({
                notation: directionalInput.notations[0].notation,
                category: 'directional-inputs',
                icon_file_name: directionalInput.icons[0].icon_file_name
            });


            // this.notationsDisplay.push(',');
            // console.log(this.notationsDisplay);
        },
        async addAttackButtonInputToDisplay(attackButtonInput: object) {
            attackButtonInput.category = 'attack-buttons';
            this.createComboDisplay.push(attackButtonInput);

            // this.notationsDisplay.push(attackButtonInput.notations[0].notation)
            this.notationsDisplay.push({
                notation: attackButtonInput.notations[0].notation,
                category: 'attack-buttons',
                icon_file_name: attackButtonInput.icon_file_name
            });
            // console.log(this.notationsDisplay);
        },
        // async addComboInputToDisplay(comboInput) {
        //     'direction' in comboInput ? comboInput.category = 'directional-inputs' : comboInput.category = 'attack-buttons'
        //     this.comboDisplay.push(comboInput);
        //     console.log(this.comboDisplay);

        // },
        async addNotationToDisplay(notation) {
            if(notation.character_id !== null) {
                notation.category = 'character-notations';
            } else {
                notation.category = 'notations'
            }
            this.createComboDisplay.push(notation);
            console.log(this.createComboDisplay);

            // this.notationsDisplay.push(notation.notation)
            this.notationsDisplay.push({
                notation: notation.notation,
                category: 'other',
                icon_file_name: notation.icon_file_name
            });
            console.log(this.notationsDisplay);
        },
        async addNotationSegments(notationSegments) {
            this.notationSegments.push(notationSegments);
            console.log(this.notationSegments);
        },
        async eraseComboInput() {
            this.createComboDisplay.pop();
            this.notationsDisplay.pop();
        },
        async clearCreateComboDisplay() {
            this.createComboDisplay = [];
            this.notationsDisplay = [];
        },
        async clearNotationSegments() {
            this.notationSegments = [];
        },
        async saveCharacterCombo(gameId: string, characterId: string, comboInputs: object) {
            try {
                await trainingModeAPI.post(`/games/${gameId}/characters/${characterId}/character-combos`, {
                    game_id: gameId,
                    character_id: characterId,
                    inputs: comboInputs
                    //hits
                })
                .then(response => {
                    console.log(response);
                    this.fetchCharacterCombos(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCharacterCombo(gameId: string, characterId: string, comboId: number,) {
            try {
                await trainingModeAPI.delete(`/games/${gameId}/characters/${characterId}/character-combos/${comboId}`)
                .then(response => {
                    console.log(response);
                    this.fetchCharacterCombos(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
        async fetchCharacterCombos(gameId: string, characterId: string) {
            const gameStore = useGameStore();
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/characters/${characterId}/character-combos`)
                // .then(response => {
                //     this.combos = response.data;
                //     // console.log(response.data);
                //     console.log(this.combos);
                // });
                this.combos = data.data;
                this.updateCharacterComboListDisplay();

                for (let i = 0; i < this.combos.length; i++) {
                    const combo = this.combos[i];
                    const comboInputs = [];
                    let comboInputsSorted = [];

                    // const moveInputs = [];
                    // move.inputs = [];
                    combo.directional_inputs.forEach(input => {
                        // console.log(input);
                        const directionalInputModel = gameStore.directionalInputs.find(directionalInput => {
                            return directionalInput.direction === input.direction;
                        });
                        // console.log(directionalInputModel);
                        const iconFileName = directionalInputModel?.icons[0].icon_file_name;
    
                        const directionalInputObject = {
                            ...input,
                            input_category: "directions",
                            img_category: "directional-inputs",
                            icon_file_name: iconFileName,
                            
                        }
                        // input.input_category = "directions";
                        // input.img_category = "directional-inputs";
                        // input.icon_file_name = iconFileName;
                        comboInputs.push(directionalInputObject);
                    })
    
                    combo.attack_buttons.forEach(input => {
                        const attackButtonModel = gameStore.attackButtons.find(attackButton => {
                            return attackButton.name === input.name;
                        }); 
                        // console.log(attackButtonModel);
                        const iconFileName = attackButtonModel?.icon_file_name;
                        const attackButtonObject = {
                            ...input,
                            input_category: "attacks",
                            img_category: "attack-buttons",
                            icon_file_name: iconFileName,
                            
                        }
                        // input.input_category = "attacks";
                        // input.img_category = "attack-buttons";
                        comboInputs.push(attackButtonObject);
                    });
    
                    // combo.notations.forEach(input => {
                    //     input.input_category = "notations";
                    //     comboInputs.push(input);
                    // });
    
                    comboInputs.forEach(input => {
                        // console.log(input);
                        input.order_in_move = input.pivot.order_in_move;
                    });
                        
                        
                    //     // input.order_in_move = input.pivot.order_in_move;
                    // });
    
                    comboInputsSorted = comboInputs.sort((a, b) => a.order_in_move - b.order_in_move);
    
                    console.log(comboInputsSorted);
                    
    
                    combo.inputs = [...comboInputsSorted];
                }
            } catch (error) {
                console.log(error);
            }

            console.log(this.combos);
        },
        async addTagToCharacterCombo(gameId: string, characterId:string, characterComboId:string, newTag: string) {
            try {
                await trainingModeAPI.post(`/games/${gameId}/characters/${characterId}/combos/${characterComboId}/tags`, {
                    tags: [newTag]
                })
                .then(response => {
                    console.log(response);
                    this.fetchCharacterCombos(gameId, characterId);
                })

            } catch (error) {
                console.log(error);
            }
        },
        async removeTagFromCharacterCombo(gameId: string, characterId: string, comboId: string, tagId: string) {
            try {
                await trainingModeAPI.delete(`/games/${gameId}/characters/${characterId}/combos/${comboId}/tags/${tagId}`)
                .then(response => {
                    console.log(response);
                    this.fetchCharacterCombos(gameId, characterId);
                    // this.updateCharacterMovesListDisplay('tags');
                    // this.searchByTagsList = [];
                })
            } catch (error) {
                console.log(error);
            }
        },
        async addCharacterComboTagToSearchList(tag: string) {
            console.log(tag);
            this.searchByTagsList.push(tag);
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
                // console.log(move);
                combo.tags.forEach(tag => {
                    console.log(tag);
                    if(this.searchByTagsList.includes(tag.name)) {
                        characterComboListFilteredByTags.push(combo);
                    }
                })
            })
            console.log(characterComboListFilteredByTags);
            this.characterComboListDisplay = [...characterComboListFilteredByTags];
            console.log(this.characterComboListDisplay);
        },
        async resetCharacterComboListDisplay() {
            this.characterComboListDisplay = [...this.combos];
        }
    }
});