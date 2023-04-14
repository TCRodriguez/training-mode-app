import { defineStore } from 'pinia';
import trainingModeAPI from '../axios-http';

export const useGameStore = defineStore('GameStore', {
    state: () => ({
        games: [],
        game: {},
        gameNotations: [],
        directionalInputNotations: [],
        attackButtons: [],
        attackButtonNotations: [],
        attackButtonIconLinks: [],
        directionalInputs: [],
        directionalInputIconLinks: [],

    }),
    getters: {
        getGame(state): object | undefined {
            return state.game;
        },
        getGames(state){
            return state.games
        },
        getAttackButtons: (state) => state.attackButtons,
        getAttackButtonSingles: (state) => {
            const attackButtonSinglesNotations = ['1', '2', '3', '4']
            const attackButtonSinglesArray: any[] = [];

            state.attackButtons.forEach(attackButton => {
                if(attackButton.notations[0] !== undefined && attackButtonSinglesNotations.includes(attackButton.notations[0].notation)) {
                    attackButtonSinglesArray.push(attackButton)
                }
            });

            console.log(attackButtonSinglesArray);

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

            console.log(attackButtonDoublesArray);

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

            console.log(attackButtonTriplesArray);

            return attackButtonTriplesArray;
        },
        getDirectionalInputTaps(state) {
            const inputs = state.directionalInputs.filter(input => !input.direction.includes('(hold)'));
            console.log(inputs);
            
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
            console.log(gameNotations);
            return gameNotations;
        },
        getInput(state) {
            // Get input that matches provided notation
            return (inputNotation: string, inputCategory: string) => {
                console.log(inputNotation, inputCategory);
                let result;
                switch (inputCategory) {
                    case 'directional-inputs':
                        result = state.directionalInputs.find((directionalInput) => directionalInput.notations[0].notation === inputNotation); 
                        console.log(result);
                        break;
                    case 'attack-buttons':
                        result = state.attackButtons.find((attackButton) => attackButton.notations[0].notation === inputNotation); 
                        console.log(result);
                        break;
                    case 'notations':
                        result = state.gameNotations.find((gameNotation) => gameNotation.notations[0].notation === inputNotation); 
                        console.log(result);
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
                console.log(data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async fetchGames() {
            try {
                const data = await trainingModeAPI.get('/games')
                console.log(data);
                this.games = data.data;
            }
            catch(error) {
                console.log(error);
            }
        },
        async fetchGameNotations(gameId: string) {
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/game-notations`)
                this.gameNotations = data.data.filter(notation => notation.notations_group === 'other');
                this.directionalInputNotations = data.data.filter(notation => notation.notations_group === 'directions');
                this.attackButtonNotations = data.data.filter(notation => notation.notations_group === 'attacks')
                // console.log(this.gameNotations);
                console.log(this.directionalInputNotations);
            } catch (error) {
                console.log(error);
            }
        },
        async fetchAttackButtons(gameId: string) {
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/attack-buttons`)
                this.attackButtons = data.data
                console.log(data.data);
            } catch(error) {
                console.log(error);
            }
        },
        async setGame(gameId: string) {
            this.game = this.games.find(game => game.id === gameId);
        }
    }
});