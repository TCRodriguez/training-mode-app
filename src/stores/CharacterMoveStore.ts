import { defineStore } from 'pinia';
import { useGameStore } from './GameStore';
import { useAuthStore } from './AuthStore';
import trainingModeApi from '../axios-http';

export const useCharacterMoveStore =  defineStore('CharacterMoveStore', {
    state: () => ({
        characterMoves: [],
        characterMoveListDisplay: [],
        characterMoveListByTagDisplay: [],
        characterMoveNameSearchInputValue: '',
        searchByTagsList: [],

    }),
    getters: {
        getCharacterMoveTags(state) {
            return function (moveId: string) {
                let characterMove = state.characterMoveListDisplay.find(move => move.id === moveId);
                let tags = [...characterMove?.tags];
                console.log(tags);
                // return state.characterMoves.
                return tags;
            }
        }
    },
    actions: {
        async fetchCharacterMoves(gameId: string, characterId: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            try {
                const data = await trainingModeApi.get(`/games/${gameId}/characters/${characterId}/moves`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                });
                this.characterMoves = data.data;
                console.log(this.characterMoves);
                // this.characterMoveListDisplay = data.data;
                this.updateCharacterMovesListDisplay('tags');



            } catch (error) {
                console.log(error);                
            }


            for (let i = 0; i < this.characterMoves.length; i++) {
                const move = this.characterMoves[i];
                const moveInputs = [];
                let moveInputsSorted = [];

                // const moveInputs = [];
                // move.inputs = [];
                move.directional_inputs.forEach(input => {
                    // console.log(input);
                    const directionalInputModel = gameStore.directionalInputs.find(directionalInput => {
                        return directionalInput.direction === input.direction;
                    });
                    // console.log(directionalInputModel);
                    // const iconFileName = directionalInputModel?.icons.icon_file_name;

                    const iconFileName = directionalInputModel?.icon_file_name;

                    const directionalInputObject = {
                        ...input,
                        input_category: "directions",
                        img_category: "directional-inputs",
                        icon_file_name: iconFileName,
                        
                    }
                    // input.input_category = "directions";
                    // input.img_category = "directional-inputs";
                    // input.icon_file_name = iconFileName;
                    moveInputs.push(directionalInputObject);
                })

                move.attack_buttons.forEach(input => {
                    const attackButtonModel = gameStore.attackButtons.find(attackButton => {
                        return attackButton.name === input.name;
                    }); 
                    console.log(attackButtonModel);
                    const iconFileName = attackButtonModel?.icon_file_name;
                    const attackButtonObject = {
                        ...input,
                        input_category: "attacks",
                        img_category: "attack-buttons",
                        icon_file_name: iconFileName,
                        
                    }
                    // input.input_category = "attacks";
                    // input.img_category = "attack-buttons";
                    moveInputs.push(attackButtonObject);
                });

                move.notations.forEach(input => {
                    input.input_category = "notations";
                    input.img_category = "notations";
                    moveInputs.push(input);
                });

                moveInputs.forEach(input => {
                    // console.log(input);
                    input.order_in_move = input.pivot.order_in_move;
                })
                    
                    
                //     // input.order_in_move = input.pivot.order_in_move;
                // });

                moveInputsSorted = moveInputs.sort((a, b) => a.order_in_move - b.order_in_move);

                console.log(moveInputsSorted);
                

                move.inputs = [...moveInputsSorted];
                
            }

            console.log(this.characterMoves);
        },
        async addTagToCharacterMove(gameId: string, characterId:string, characterMoveId:string, newTag: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            try {
                await trainingModeApi.post(`/games/${gameId}/characters/${characterId}/moves/${characterMoveId}/tags`, {
                    tags: [newTag]
                }, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    console.log(response);
                    gameStore.fetchTags(gameId);
                    this.fetchCharacterMoves(gameId, characterId);
                })

            } catch (error) {
                
            }
        },
        async updateCharacterMoveSearchCriteria(input: string) {
            this.characterMoveNameSearchInputValue = input;
            console.log(this.characterMoveNameSearchInputValue);
        },

        async updateCharacterMovesListDisplay(criteria: string = ''): Promise<void> {
            let characterMoveListFilteredByTags: object[] = [];


            console.log(this.characterMoveNameSearchInputValue);
            if(this.characterMoveNameSearchInputValue.length === 0) {
                this.characterMoveListDisplay = [...this.characterMoves];
            } else {
                this.characterMoveListDisplay = this.characterMoves.filter(characterMove => characterMove.name.toLowerCase().includes(this.characterMoveNameSearchInputValue.toLowerCase()));
            }

            if(criteria === 'tags') {
                // ! characterMove.tags is an array of objects...
                // ! Iterate through `tags` to identify 

                // this.characterMoveListDisplay = this.characterMoves.filter(characterMove => characterMove.tags.includes(this.searchByTagsList));
                if(this.searchByTagsList.length === 0) {
                    this.resetCharacterMoveListDisplay();
                    return;
                }

                this.characterMoves.forEach(move => {
                    // console.log(move);
                    move.tags.forEach(tag => {
                        console.log(tag);
                        if(this.searchByTagsList.includes(tag.name)) {
                            characterMoveListFilteredByTags.push(move);
                        }
                    })
                })
                console.log(characterMoveListFilteredByTags);
                this.characterMoveListDisplay = [...characterMoveListFilteredByTags];
                console.log(this.characterMoveListDisplay);
            }
        },

        async addCharacterMoveTagToSearchList(tag: string) {
            this.searchByTagsList.push(tag);
        },

        async removeCharacterMoveTagFromSearchList(tag: string) {
            this.searchByTagsList.splice(this.searchByTagsList.indexOf(tag), 1);
        },

        async resetCharacterMoveListDisplay() {
            this.characterMoveListDisplay = [...this.characterMoves];
        },

        async removeTagFromCharacterMove(gameId: string, characterId: string, moveId: string, tagId: string) {
            const authStore = useAuthStore();
            try {
                await trainingModeApi.delete(`/games/${gameId}/characters/${characterId}/moves/${moveId}/tags/${tagId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                .then(response => {
                    console.log(response);
                    this.fetchCharacterMoves(gameId, characterId);
                    // this.updateCharacterMovesListDisplay('tags');
                    // this.searchByTagsList = [];
                })
            } catch (error) {
                console.log(error);
            }
        }
    }
});