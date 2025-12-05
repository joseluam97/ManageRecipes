
import {
    postIngredientRecipe,
    putIngredientRecipe,
    getIngredientsByRecipe,
    deleteIngredientRecipe
} from 'src/redux/ingredients/actions'

export const createIngredientRecipe = async (details_ingredient, dispatch) => {
    const resultPostIngredient = await dispatch(postIngredientRecipe(details_ingredient));
    if (postIngredientRecipe.fulfilled.match(resultPostIngredient)) {
        if (resultPostIngredient.payload != undefined) {
            const ingredient_new = resultPostIngredient.payload;
            return ingredient_new
        }
    }
}

export const updateIngredientRecipe = async (details_ingredient, dispatch) => {
    const resultPutIngredient = await dispatch(putIngredientRecipe(details_ingredient));
    if (putIngredientRecipe.fulfilled.match(resultPutIngredient)) {
        if (resultPutIngredient.payload != undefined) {
            const ingredient_update = resultPutIngredient.payload;
            return ingredient_update
        }
    }
}
export const removeIngredientRecipe = async (id_ingredient, dispatch) => {
    const resultDeleteIngredient = await dispatch(deleteIngredientRecipe(id_ingredient));
    if (deleteIngredientRecipe.fulfilled.match(resultDeleteIngredient)) {
        if (resultDeleteIngredient.payload != undefined) {
            const ingredient_delete = resultDeleteIngredient.payload;
            return ingredient_delete
        }
    }
}

export const getListIngredientsByRecipe = async (idRecipe, dispatch) => {
    const resultlistIngredient = await dispatch(getIngredientsByRecipe(idRecipe));
    if (getIngredientsByRecipe.fulfilled.match(resultlistIngredient)) {
        if (resultlistIngredient.payload != undefined) {
            const listIngredientRecipe = resultlistIngredient.payload;
            return listIngredientRecipe
        }
    }
}