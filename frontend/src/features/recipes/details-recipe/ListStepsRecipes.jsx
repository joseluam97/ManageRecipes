import {
    Box,
    Typography,
    Avatar,
    Skeleton,
    Paper,
    Stack,
    IconButton
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import ElaborationPanel from 'src/features/elaboration/ElaborationPanel';
import { setListStepsNewRecipe } from 'src/redux/recipe/actions'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { putRecipe } from 'src/redux/recipe/actions'

export default function ListStepsRecipes({ recipe, setEditSteps }) {

    const dispatch = useDispatch();

    const [listElaboration, setListElaboration] = useState([]);
    const [showEditSteps, setShowEditSteps] = useState(false);

    useEffect(() => {
        if(recipe != undefined){
            setListElaboration(recipe?.elaboration)
        }
    }, [recipe]);

    const editSteps = () => {
        dispatch(setListStepsNewRecipe(listElaboration));

        setShowEditSteps(true);
        setEditSteps(true)
    }

    const updateListSteps = (data) => {
        let listUpdate = [...data]

        const updateRecipe = {
            id: recipe?.id,
            elaboration: listUpdate,
        };

        updateElaborationRecipe(updateRecipe);
        setEditSteps(false)
    }

    const updateElaborationRecipe = async (new_elaboration) => {
        const resultAction = await dispatch(putRecipe(new_elaboration));
        if (putRecipe.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const recipesReceive = resultAction.payload;
                console.log("RECIPE UPDATE");
                console.log(recipesReceive);

                setListElaboration(recipesReceive?.elaboration)
            }
        }
    };

    return (
        <Box width="100%">
            <Stack direction="row" flexShrink={0} sx={{ my: 0, width: '100%' }} justifyContent="flex-start" alignItems="center">
                <Typography variant="h5" fontWeight="medium" gutterBottom>Elaboration</Typography>
                <IconButton onClick={editSteps} color="primary">
                    <Edit />
                </IconButton>
            </Stack>

            {showEditSteps && (
                <Box width="100%">
                    <ElaborationPanel
                        onClose={() => setShowEditSteps(false)}
                        setIdSteps={updateListSteps}
                    />
                </Box>
            )}

            {!showEditSteps && (
                <Box component="ol" sx={{ pl: 3 }}>
                    {recipe ? (
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                            {listElaboration?.map((step, idx) => (
                                <Box
                                    component="li"
                                    key={`list-step-recipe-${recipe?.id}-${idx}`}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 1,
                                        listStyle: 'none',
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 24,
                                            height: 24,
                                            fontSize: 12,
                                        }}
                                    >
                                        {idx + 1}
                                    </Avatar>
                                    <Typography variant="body2">{step}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        [1, 2, 3].map((i) => (
                            <li key={`list-example-step-recipe-${recipe?.id}-${i}`}>
                                <Skeleton width="90%" />
                            </li>
                        ))
                    )}
                </Box>
            )}
        </Box>
    );

}
