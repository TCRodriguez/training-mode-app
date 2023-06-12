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
                
                return tags;
            }
        }
    },
    actions: {
        async fetchCharacterMoves(gameId: string, characterId: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();

            const endpoint = authStore.loggedInUser === null ? `/games/${gameId}/characters/${characterId}/moves/guest` : `/games/${gameId}/characters/${characterId}/moves/`;

            try {
                const data = await trainingModeApi.get(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                });
                console.log(data.data);
                this.characterMoves = data.data;
                
                this.updateCharacterMovesListDisplay();
                gameStore.fetchTags(gameId)
                .then(response => {
                    console.log(response);
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
        async fetchCharacterMoveTags(gameId: string, characterId: string) {
            const authStore = useAuthStore();
            try {
                const data = await trainingModeApi.get(`/games/${gameId}/characters/${characterId}/tags`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                });
            } catch (error) {
                console.log(error);
            }
        },
        async addTagToCharacterMove(gameId: string, characterId:string, characterMoveId:string, newTag: string) {
            const authStore = useAuthStore();
            const gameStore = useGameStore();
            console.log('add tag to move hit');
            try {
                await trainingModeApi.post(`/games/${gameId}/characters/${characterId}/moves/${characterMoveId}/tags`, {
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
                    this.fetchCharacterMoves(gameId, characterId);
                })

            } catch (error) {
                console.log(error);
            }
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
                    this.fetchCharacterMoves(gameId, characterId);
                })
            } catch (error) {
                console.log(error);
            }
        },
    }
});