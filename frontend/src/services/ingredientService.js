import {
    getAllIngredients,
    postIngredient,
    putIngredient,
    deleteIngredient
} from 'src/redux/ingredients/actions'

export const postNewIngredient = async (name_ingredient, dispatch) => {
    const resultAction = await dispatch(postIngredient(name_ingredient));
    if (postIngredient.fulfilled.match(resultAction)) {
        if (resultAction.payload != undefined) {
            const newIngredientsReceive = Object.values(resultAction.payload);
            return newIngredientsReceive
        }
    }
};

export const updateIngredient = async (id, name, dispatch) => {
    const resultAction = await dispatch(putIngredient({ id, name }));
    if (putIngredient.fulfilled.match(resultAction)) {
        if (resultAction.payload != undefined) {
            return resultAction.payload;
        }
    }
};

export const eraseIngredient = async (id, dispatch) => {
    const resultAction = await dispatch(deleteIngredient(id));
    if (deleteIngredient.fulfilled.match(resultAction)) {
        if (resultAction.payload != undefined) {
            const item_delete = resultAction.payload;
            return item_delete;
        }
    }
};

export const getListIngredients = async (dispatch) => {
    const resultAction = await dispatch(getAllIngredients());
    if (getAllIngredients.fulfilled.match(resultAction)) {
        if (resultAction.payload != undefined) {
            const listIngredientsReceive = Object.values(resultAction.payload);
            return listIngredientsReceive;
        }
    }
};