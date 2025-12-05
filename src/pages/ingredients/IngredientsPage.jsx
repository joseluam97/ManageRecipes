import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import SimpleTable from '../../components/table/SimpleTable'
import { useSnackbar } from 'src/components/snackbar/SnackbarProvider';
import IngredientsRecipeDialog from '../../features/ingredients/dialog/IngredientsRecipeDialog';
import { getListRecipesByIngredient } from 'src/services/recipeService'
import { getListIngredients, postNewIngredient, updateIngredient, eraseIngredient } from 'src/services/ingredientService'

const Ingredients = () => {
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();

    const [dialogRecipesOpen, setDialogRecipesOpen] = React.useState(false);
    const [listIngredientsRecipesReceive, setListIngredientsRecipesReceive] = React.useState([]);
    const [listTodosIngredientes, setListTodosIngredientes] = useState([]);

    useEffect(() => {
        getAllIngredients();
    }, []);

    const getAllIngredients = async () => {
        let listIngredientsReceive = await getListIngredients(dispatch);

        listIngredientsReceive = listIngredientsReceive?.sort((a, b) => a.name.localeCompare(b.name));
        setListTodosIngredientes(listIngredientsReceive);
    }

    const createNewElement = async (name_ingredient) => {
        await postNewIngredient(name_ingredient, dispatch)
        getListIngredients();
    }

    const editElement = async (id_ingredient, name_ingredient) => {
        await updateIngredient(id_ingredient, name_ingredient, dispatch);

        // Update list ingredientes
        getListIngredients()
    }

    const deleteElement = async (id_ingredient) => {
        let listRecipesIncludeIngredient = await getListRecipesByIngredient(id_ingredient, dispatch);
        if (listRecipesIncludeIngredient.length != 0) {
            showSnackbar('It is not possible to delete the ingredient because it is associated with a recipe.', 'error');
            return;
        }

        let item_delete = await eraseIngredient(id_ingredient, dispatch);

        if (item_delete?.name != undefined) {
            showSnackbar("The ingredient " + item_delete.name + " has been removed", 'success');
            // Update list ingredientes
            getListIngredients()
        }
        else {
            showSnackbar('An error occurred and the ingredient could not be removed.', 'error');
        }
    }

    const getListRecipesIncludes = async (id_ingredient) => {
        let listRecipesIncludeIngredient = await getListRecipesByIngredient(id_ingredient, dispatch);

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
            <SimpleTable
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
