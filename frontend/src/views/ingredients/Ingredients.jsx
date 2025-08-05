import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllIngredients, postIngredient, putIngredient, deleteIngredient } from 'src/redux/ingredients/actions'
import { getRecipesByIngredient } from 'src/redux/ingredients/actions'
import TableDetails from '../TableDetails'
import { useSnackbar } from 'src/components/SnackbarProvider';
import IngredientsRecipeDialog from './dialog/IngredientsRecipeDialog';

const Ingredients = () => {
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();

    const [dialogRecipesOpen, setDialogRecipesOpen] = React.useState(false);
    const [listIngredientsRecipesReceive, setListIngredientsRecipesReceive] = React.useState([]);
    const [listTodosIngredientes, setListTodosIngredientes] = useState([]);

    useEffect(() => {
        getListIngredients();
    }, []);

    const getListIngredients = async () => {
        const resultAction = await dispatch(getAllIngredients());
        if (getAllIngredients.fulfilled.match(resultAction)) {
            if (resultAction.payload !== undefined) {
                const listIngredientsReceive = Object
                    .values(resultAction.payload)
                    .sort((a, b) => a.name.localeCompare(b.name));
                setListTodosIngredientes(listIngredientsReceive);
            }
        }
    };

    const postNewIngredient = async (name_ingredient) => {
        const resultAction = await dispatch(postIngredient(name_ingredient));
        if (postIngredient.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                // Update list ingredientes
                getListIngredients()
            }
        }
    };

    const updateIngredient = async (id, name) => {
        const resultAction = await dispatch(putIngredient({ id, name }));
        if (putIngredient.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                // Update list ingredientes
                getListIngredients()
            }
        }
    };

    const eraseIngredient = async (id) => {
        const resultAction = await dispatch(deleteIngredient(id));
        if (deleteIngredient.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                let item_delete = resultAction.payload;

                showSnackbar("The ingredient " + item_delete.name + " has been removed", 'success');
                // Update list ingredientes
                getListIngredients()
            }
        }
        else {
            showSnackbar('An error occurred and the ingredient could not be removed.', 'error');
        }
    };

    const getListRecipesByIngredient = async (id_ingredient) => {
        const resultAction = await dispatch(getRecipesByIngredient(id_ingredient));
        if (getRecipesByIngredient.fulfilled.match(resultAction) && resultAction.payload != undefined) {
            const listIngredientsByRecipe = Object.values(resultAction.payload);

            console.log("LOL")
            console.log(listIngredientsByRecipe)
            return listIngredientsByRecipe;
        }
        return [];
    };


    const createNewElement = (name_ingredient) => {
        console.log("Name new ingredient: " + name_ingredient)
        postNewIngredient(name_ingredient)
    }

    const editElement = (id_ingredient, name_ingredient) => {
        console.log("ID ingredient: " + id_ingredient);
        console.log("New name ingredient: " + name_ingredient);
        updateIngredient(id_ingredient, name_ingredient)
    }

    const deleteElement = async (id_ingredient) => {
        console.log("ID ingredient: " + id_ingredient)
        let listRecipesIncludeIngredient = await getListRecipesByIngredient(id_ingredient);
        console.log("-listRecipesIncludeIngredient: ")
        console.log(listRecipesIncludeIngredient)
        if (listRecipesIncludeIngredient.length != 0) {
            showSnackbar('It is not possible to delete the ingredient because it is associated with a recipe.', 'error');
            return;
        }

        eraseIngredient(id_ingredient);
    }

    const getListRecipesIncludes = async (id_ingredient) => {
        console.log("ID ingredient: " + id_ingredient)
        let listRecipesIncludeIngredient = await getListRecipesByIngredient(id_ingredient);

        if (listRecipesIncludeIngredient.length == 0) {
            showSnackbar('No recipes found for this ingredient.', 'info');
            setListIngredientsRecipesReceive([]);
            return;
        }

        setListIngredientsRecipesReceive(listRecipesIncludeIngredient)
        setDialogRecipesOpen(true);
    }

    return (
        <>
            <TableDetails
                title_element={"ingredient"}
                list_element={listTodosIngredientes}
                createNewElement={createNewElement}
                editElement={editElement}
                deleteElement={deleteElement}
                getListRecipesIncludes={getListRecipesIncludes}
                showListRecipesIncludes={true}
            />
            <IngredientsRecipeDialog
                open={dialogRecipesOpen}
                onClose={() => setDialogRecipesOpen(false)}
                ingredientsData={listIngredientsRecipesReceive}
            />
        </>
    );
};

export default Ingredients;
