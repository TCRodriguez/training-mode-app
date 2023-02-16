import { defineStore } from 'pinia';
import trainingModeAPI from '../axios-http';

export const useGameStore = defineStore('GameStore', {
    state: () => ({
        games: [],
        game: {},
        gameNotations: [],
        attackButtons: [],
        attackButtonIconLinks: [],
        directionalInputs: [],
        directionalInputIconLinks: [],

    }),
    getters: {
        getGames(state){
            return state.games
        },
        getAttackButtons: (state) => state.attackButtons
    },
    actions: {
        async fetchDirectionalInputs() {
            try {
                const data = await trainingModeAPI.get('/directional-inputs');
                this.directionalInputs = data.data;
                console.log(data);
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
        async fetchNotations(gameId: string) {
            try {
                const data = await trainingModeAPI.get(`/games/${gameId}/game-notations`)
                this.gameNotations = data.data.filter(notation => notation.notations_group === 'other');
                console.log(this.gameNotations);
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