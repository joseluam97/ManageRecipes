import {
    getAllRecipes,
    postNewRecipe,
    putRecipe,
    deleteRecipe
} from 'src/redux/recipe/actions'
import { getRecipesByIngredient } from 'src/redux/ingredients/actions'

export const createNewRecipe = async (newRecipe, dispatch) => {
        const resultAction = await dispatch(postNewRecipe(newRecipe));
        if (postNewRecipe.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const recipesReceive = resultAction.payload;
                return recipesReceive;
            }
        }
    };

export const getRecipes = async (dispatch) => {
    const resultAction = await dispatch(getAllRecipes());
    if (getAllRecipes.fulfilled.match(resultAction)) {
        if (resultAction.payload != undefined) {
            const listRecipesReceive = Object.values(resultAction.payload);
            return listRecipesReceive;
        }
    }
}

export const updateRecipe = async (update_recipe, dispatch) => {
    const resultAction = await dispatch(putRecipe(update_recipe));
    if (putRecipe.fulfilled.match(resultAction)) {
        if (resultAction.payload != undefined) {
            const recipesReceive = resultAction.payload;
            return recipesReceive;
        }
    }
};

export const removeRecipe = async (idRecipe, dispatch) => {
    const resultDeleteRecipe = await dispatch(deleteRecipe(idRecipe));
    if (deleteRecipe.fulfilled.match(resultDeleteRecipe)) {
        if (resultDeleteRecipe.payload != undefined) {
            const idRecipeReceive = resultDeleteRecipe.payload;
            return idRecipeReceive
        }
    }
}

export const getListRecipesByIngredient = async (id_ingredient, dispatch) => {
    const resultAction = await dispatch(getRecipesByIngredient(id_ingredient));
    if (getRecipesByIngredient.fulfilled.match(resultAction) && resultAction.payload != undefined) {
        return Object.values(resultAction.payload);
    }
    return [];
};