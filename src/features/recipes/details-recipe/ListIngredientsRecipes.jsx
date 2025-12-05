import {
    Box,
    Typography,
    Avatar,
    Paper,
    Skeleton,
    Stack,
    IconButton
} from '@mui/material';

import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toTitleCase } from 'src/utils/format-text'
import { useDispatch, useSelector } from 'react-redux';
import { Edit } from '@mui/icons-material';
import { setListCurrentIngredient } from 'src/redux/assign_ingredients/actions'
import { setModeWindowIngredient } from 'src/redux/assign_ingredients/actions'
import AssignIngredientsPanel from 'src/features/ingredients/assign-ingredients/AssignIngredientsPanel';
import { createIngredientRecipe, updateIngredientRecipe, removeIngredientRecipe, getListIngredientsByRecipe } from 'src/services/ingredientRecipeService'
import { postNewGroup, removeGroup } from 'src/services/groupService'
import { useIsUserLoggedIn } from 'src/services/userService'    

export default function ListIngredientsRecipes({ id_recipe, setEditIngredients }) {
  const isLoggedIn = useIsUserLoggedIn();

    const location = useLocation();
    const dispatch = useDispatch();

    const [listIngredientsRecipe, setListIngredientsRecipes] = useState([]);

    const [showEditIngredients, setShowEditIngredients] = useState(false);
    const [listNewIngredients, setListNewIngredients] = useState([]);

    const [initialListGroup, setInitialListGroup] = useState([]);
    const [initialListIngredients, setInitialListIngredients] = useState([]);

    useEffect(() => {
        getInfoRecipe();
    }, [location.pathname]);

    const getInfoRecipe = async () => {
        const listIngredientsByRecipe = await getListIngredientsByRecipe(Number(id_recipe), dispatch);

        let pruebaIngredientes = [...listIngredientsByRecipe]

        const agrupado = pruebaIngredientes.reduce((acc, item) => {
            const grupo = item?.group?.name || '';
            if (!acc[grupo]) {
                acc[grupo] = [];
            }
            acc[grupo].push(item);
            return acc;
        }, {});

        const grupos = Object.entries(agrupado).map(([grupo, items]) => ({
            grupo,
            ingredientes: items
        }));
        const list_groups = Object.values(grupos);

        const list_group_sort = [
            ...list_groups.filter(item => item.grupo === ""),
            ...list_groups.filter(item => item.grupo !== "")
        ];

        setListIngredientsRecipes(Object.values(list_group_sort))

    };
    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await setChangesInIngredients();
                console.log(data);
            } catch (error) {
                console.error("Error al cargar datos", error);
            }
        };

        fetchData();

    }, [listNewIngredients]);

    const setChangesInIngredients = async () => {
        console.log("-CHANGE initialListGroup-")
        console.log(initialListGroup)

        let cambiosGroups = getGroupChanges(initialListIngredients, listNewIngredients);
        console.log("CAMBIOS GRUPOS");
        console.log(cambiosGroups);

        let listNewGroup = [...cambiosGroups.added]
        let list_all_groups = [...initialListGroup]

        // Create new groups
        for (const name of listNewGroup) {
            const newGroupReceive = await postNewGroup(name, dispatch);
            if (newGroupReceive) {
                list_all_groups.push(newGroupReceive);
            }
        }

        console.log("-CHANGE list_all_groups-")
        console.log(list_all_groups)

        const cambios = compararIngredientes(initialListIngredients, listNewIngredients);
        console.log("Añadidos:", cambios.añadidos);
        console.log("Eliminados:", cambios.eliminados);
        console.log("Modificados:", cambios.modificados);

        for (const ingredient_new of cambios.añadidos) {
            let group_selected = list_all_groups.filter(element => element.name == ingredient_new.group)[0]

            let details_ingredient = {
                ingredient: ingredient_new.ingredient.id,
                cuantity: Number(ingredient_new.quantity),
                unit: ingredient_new.unit.id,
                recipe: Number(id_recipe),
                group: ingredient_new.group != "" && group_selected != undefined ? group_selected.id : null,
            }

            console.log("-details_ingredient-")
            console.log(details_ingredient)

            const result_ingredient_new = await createIngredientRecipe(details_ingredient, dispatch);
            console.log(result_ingredient_new)
        }

        for (const ingredient_update of cambios.modificados) {
            let ingredient_update_after = ingredient_update.despues;
            let group_selected = list_all_groups.filter(element => element.name == ingredient_update_after.group)[0]

            console.log("-ingredient_update_after-")
            console.log(ingredient_update_after)
            let details_ingredient = {
                id: ingredient_update_after.id,
                ingredient: ingredient_update_after.ingredient.id,
                cuantity: ingredient_update_after.quantity,
                unit: ingredient_update_after.unit.id,
                recipe: id_recipe,
                group: ingredient_update_after.group != "" && group_selected != undefined ? group_selected.id : null,
            }

            const result_ingredient_update = await updateIngredientRecipe(details_ingredient, dispatch);
            console.log(result_ingredient_update)
        }

        for (const ingredient_delete of cambios.eliminados) {
            const result_ingredient_update = await removeIngredientRecipe(ingredient_delete.id, dispatch);
            console.log(result_ingredient_update)
        }

        // Check if any of the groups are no longer used and therefore should be deleted.
        let listGroupDeleted = [...cambiosGroups.removed]

        console.log("-listGroupDeleted-")
        console.log(listGroupDeleted)
        for (const groupDelete of listGroupDeleted) {
            let group_selected = list_all_groups.filter(element => element.name == groupDelete)[0]
            if (group_selected != undefined) {
                removeGroup(group_selected.id, dispatch)
            }
        }

        // Update list ingredients
        getInfoRecipe();

    }


    const getGroupChanges = (arrayInitial, arrayEnd) => {
        const getGroups = (arr) => new Set(arr.map(el => el.group.trim()).filter(g => g !== ''));

        const groupsA = getGroups(arrayInitial);
        const groupsB = getGroups(arrayEnd);

        const added = [...groupsB].filter(g => !groupsA.has(g));
        const removed = [...groupsA].filter(g => !groupsB.has(g));

        return { added, removed };
    }

    const compararIngredientes = (arrayInitial, arrayEnd) => {
        const mapA = new Map(arrayInitial.map(item => [item.ingredient.id, item]));
        const mapB = new Map(arrayEnd.map(item => [item.ingredient.id, item]));

        const cambios = {
            añadidos: [],
            eliminados: [],
            modificados: []
        };

        // Detectar eliminados o modificados
        for (const [id, itemA] of mapA) {
            const itemB = mapB.get(id);
            if (!itemB) {
                cambios.eliminados.push(itemA);
            } else {
                const haCambiado =
                    itemA.quantity !== itemB.quantity ||
                    itemA.unit.id !== itemB.unit.id ||
                    itemA.group !== itemB.group;

                if (haCambiado) {
                    cambios.modificados.push({ antes: itemA, despues: itemB });
                }
            }
        }

        // Detectar añadidos
        for (const [id, itemB] of mapB) {
            if (!mapA.has(id)) {
                cambios.añadidos.push(itemB);
            }
        }

        return cambios;
    }

    const extractUniqueGroups = (data) => {
        const groupMap = new Map();

        data.forEach(grupoItem => {
            grupoItem.ingredientes.forEach(ing => {
                if (ing.group && !groupMap.has(ing.group.id)) {
                    groupMap.set(ing.group.id, { id: ing.group.id, name: ing.group.name });
                }
            });
        });

        return Array.from(groupMap.values());
    }


    const editIngredients = () => {
        console.log("-listIngredientsRecipe-")
        console.log(listIngredientsRecipe)
        dispatch(setModeWindowIngredient("edit"));
        setEditIngredients(true)
        // Get format all ingredients
        let listIngredientsInclude = []
        listIngredientsInclude = listIngredientsRecipe.flatMap(grupoItem => {
            return grupoItem.ingredientes.map(ing => ({
                id: ing.id,
                ingredient: ing.ingredient,
                quantity: ing.cuantity,
                unit: ing.unit,
                group: ing.group?.name || ""
            }));
        });

        // Get list object group
        const allGroupsInitial = extractUniqueGroups(listIngredientsRecipe);
        setInitialListGroup(allGroupsInitial)

        console.log("-allGroupsInitial-")
        console.log(allGroupsInitial)

        console.log("-listIngredientsInclude-")
        console.log(listIngredientsInclude)
        setInitialListIngredients(listIngredientsInclude)
        dispatch(setListCurrentIngredient(listIngredientsInclude));

        setShowEditIngredients(true);
    }

    const updateListIngredient = (data) => {
        console.log("-updateListIngredient-")
        console.log(data)
        let listUpdate = [...data]
        setListNewIngredients(listUpdate);

        setEditIngredients(false)
    }

    return (
        <>
            {showEditIngredients && (
                <Box width="100%">
                    <AssignIngredientsPanel
                        onClose={() => setShowEditIngredients(false)}
                        setIdIngredients={updateListIngredient}
                    />
                </Box>
            )}
            {!showEditIngredients && (
                <Box width="35%">
                    <Stack direction="row" flexShrink={0} sx={{ my: 0, width: '100%' }} justifyContent="flex-start" alignItems="center">
                        <Typography variant="h5" fontWeight="medium" gutterBottom>Ingredients</Typography>
                        {isLoggedIn ? 
                        (<IconButton onClick={editIngredients} color="primary">
                            <Edit />
                        </IconButton>) : 
                    (<></>)}
                    </Stack>

                    {listIngredientsRecipe.length > 0 ? (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {listIngredientsRecipe.map((grupoItem, grupoIdx) => (
                                <Box key={grupoIdx} display="flex" flexDirection="column" gap={1}>
                                    {grupoItem.grupo != "" ? (
                                        <Typography variant="body1" fontWeight="bold">
                                            {grupoItem.grupo}
                                        </Typography>
                                    ) : <></>}

                                    {grupoItem.ingredientes.map((item, idx) => (
                                        <Paper
                                            key={grupoIdx + "-" + idx}
                                            elevation={1}
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        width: 24,
                                                        height: 24,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {item.ingredient?.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {toTitleCase(item?.ingredient?.name)}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" spacing={1}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.cuantity}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {toTitleCase(item?.unit?.name)}
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Skeleton variant="rectangular" width="100%" height={100} />
                    )}

                </Box>
            )}
        </>
    );

}
