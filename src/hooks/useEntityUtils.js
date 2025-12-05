import { useRecipeData } from '../contexts/RecipeDataContext';

export const useEntityUtils = () => {
    const { listTypes, listIngredients, listUnits, listLevels, listOrders, listSources } = useRecipeData();

    const getNameIngredient = (id) => {
        const item = listIngredients.find(el => el.id === id);
        return item?.name || 'Unknown';
    };

    const getNameUnit = (id) => {
        const item = listUnits.find(el => el.id === id);
        return item?.name || 'Unknown';
    };

    const getNameType = (id) => {
        const item = listTypes.find(el => el.id === id);
        return item?.name || 'Unknown';
    };

    const getNameLevel = (id) => {
        const item = listLevels.find(el => el.id === id);
        return item?.name || 'Unknown';
    };
    
    const getNameOrder = (id) => {
        const item = listOrders.find(el => el.id === id);
        return item?.name || 'Unknown';
    };
    
    const getNameSource = (id) => {
        const item = listSources.find(el => el.id === id);
        return item?.name || 'Unknown';
    };

    return {
        getNameIngredient,
        getNameUnit,
        getNameType,
        getNameLevel,
        getNameOrder,
        getNameSource,
    };
};
