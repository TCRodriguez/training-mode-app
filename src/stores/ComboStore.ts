import { defineStore } from 'pinia';
import trainingModeAPI from '../axios-http';

export const useComboStore = defineStore('ComboStore', {
    state: () => ({
        comboDisplay: []
    }),
    getters: {

    },
    actions: {
        async addComboInputToDisplay(comboInput) {
            'direction' in comboInput ? comboInput.category = 'directional-inputs' : comboInput.category = 'attack-buttons'
            this.comboDisplay.push(comboInput);
            console.log(comboInput);

        },
        async addNotationToDisplay(notation) {
            this.comboDisplay.push(notation);
            console.log(this.comboDisplay);
        },
        async eraseComboInput() {
            this.comboDisplay.pop();
        },
        async clearComboDisplay() {
            this.comboDisplay = [];
        }
    }
});