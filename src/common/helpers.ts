import { useComboStore } from "@/stores/ComboStore";
const comboStore = useComboStore();

export const renderComboInput = (input: string) => {
    comboStore.addComboInputToDisplay(input);
};

export const renderNotationInput = (notation: object) => {
    comboStore.addNotationToDisplay(notation);
}

export const addNotationToNotationDisplay = (notation: string) => {
    comboStore.notationsDisplay.push(notation);

}