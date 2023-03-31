import { defineStore } from 'pinia';
// import { addNotationToNotationDisplay } from '@/common/helpers';
import trainingModeAPI from '../axios-http';

export const useComboStore = defineStore('ComboStore', {
    state: () => ({
        comboDisplay: [],
        notationsDisplay: [],
        notationSegments: []
    }),
    getters: {

    },
    actions: {
        async addDirectionalInputToDisplay(directionalInput: object) {
            directionalInput.category = 'directional-inputs';
            this.comboDisplay.push(directionalInput)
            // this.notationsDisplay.push(directionalInput.)
            console.log(this.comboDisplay);

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
            this.comboDisplay.push(attackButtonInput);

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
            this.comboDisplay.push(notation);
            console.log(this.comboDisplay);

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
            this.comboDisplay.pop();
            this.notationsDisplay.pop();
        },
        async clearComboDisplay() {
            this.comboDisplay = [];
            this.notationsDisplay = [];
        },
        async clearNotationSegments() {
            this.notationSegments = [];
        }
    }
});