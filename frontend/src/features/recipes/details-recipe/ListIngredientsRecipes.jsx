import {
    Box,
    Typography,
    Avatar,
    Paper,
    Skeleton,
    Stack,
    IconButton
} from '@mui/material';
import { useState, useEffect } from 'react';
import { toTitleCase } from 'src/utils/format-text'
import { useDispatch, useSelector } from 'react-redux';
import { Edit } from '@mui/icons-material';
import { setListCurrentIngredient } from 'src/redux/assign_ingredients/actions'
import { setModeWindowIngredient } from 'src/redux/assign_ingredients/actions'
import AssignIngredientsPanel from 'src/features/ingredients/assign-ingredients/AssignIngredientsPanel';

export default function ListIngredientsRecipes({ listIngredientsRecipe, setEditIngredients }) {

    const dispatch = useDispatch();

    const [showEditIngredients, setShowEditIngredients] = useState(false);
    const [listNewIngredients, setListNewIngredients] = useState([]);

    useEffect(() => {
        console.log("-CHANGE listNewIngredients-")
        console.log(listNewIngredients)
    }, [listNewIngredients]);

    const editIngredients = () => {
        dispatch(setModeWindowIngredient("edit"));
        setEditIngredients(true)
        let listIngredientsInclude = []
        for (let index_group in listIngredientsRecipe) {
            for (let index_ingredients in listIngredientsRecipe[index_group].ingredientes) {
                let element_ingredient = listIngredientsRecipe[index_group].ingredientes[index_ingredients];
                let new_element = {
                    ingredient: element_ingredient.ingredient,
                    quantity: element_ingredient.cuantity,
                    unit: element_ingredient.unit,
                    group: element_ingredient.group != null ? element_ingredient.group.name : ""
                }
                listIngredientsInclude.push(new_element)
            }
        }
        
        console.log("-listIngredientsInclude-")
        console.log(listIngredientsInclude)
        dispatch(setListCurrentIngredient(listIngredientsInclude));

        setShowEditIngredients(true);
    }

return (
    <>
        {showEditIngredients && (
            <Box width="100%">
                <AssignIngredientsPanel
                    onClose={() => setShowEditIngredients(false)}
                    setIdIngredients={setListNewIngredients}
                />
            </Box>
        )}
        {!showEditIngredients && (
            <Box width="35%">
                <Stack direction="row" flexShrink={0} sx={{ my: 0, width: '100%' }} justifyContent="flex-start" alignItems="center">
                    <Typography variant="h5" fontWeight="medium" gutterBottom>Ingredients</Typography>
                    <IconButton onClick={editIngredients} color="primary">
                        <Edit />
                    </IconButton>
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
