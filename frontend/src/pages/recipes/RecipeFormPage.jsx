import {
    Container,
    Box,
    Typography,
    Divider,
    TextField,
    MenuItem,
    Button,
    Autocomplete,
    Avatar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    COUNTRY_DEFAULT
} from 'src/utils/constant';

import AssignIngredientsPanel from '../../features/ingredients/assign-ingredients/AssignIngredientsPanel';
import ElaborationPanel from '../../features/elaboration/ElaborationPanel';
import MultiSelectAutocomplete from '../../components/selectors/MultiSelectAutocomplete'

import { getListCountries } from 'src/utils/countries'
import { postNewRecipe } from 'src/redux/recipe/actions'
import { postIngredientRecipe } from 'src/redux/ingredients/actions'
import { setListCurrentIngredient } from 'src/redux/assign_ingredients/actions'
import { useRecipeData } from '../../contexts/RecipeDataContext';
import { setModeWindowIngredient } from 'src/redux/assign_ingredients/actions'

import { postGroup } from 'src/redux/groups/actions'

export default function RecipeFormPage() {

    const { listTypes, listOrders, listLevels, listSources, listTags } = useRecipeData();

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [showIngredients, setShowIngredients] = useState(false);
    const [showElaborationSteps, setShowElaborationSteps] = useState(false);

    const listIngredientsNewRecipesAPI = useSelector((state) => state.assignIngredientsComponent.listCurrentIngredients);

    const [form, setForm] = useState({
        name: '',
        ingredients: [],
        elaboration: [],
        preparation_time: '',
        link: '',
        type: '',
        difficulty: '',
        country_origin: '',
        order: '',
        source: '',
        tags: '',
        image: '',
    });

    useEffect(() => {

        // Get list Countries
        fetchCountries();

    }, [location.pathname]);

    const fetchCountries = async () => {
        const listCountries = await getListCountries();

        setCountries(listCountries);
        const posSpain = listCountries.find(element => element.label === COUNTRY_DEFAULT);
        setForm(prev => ({ ...prev, country_origin: posSpain?.label || '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.type) newErrors.type = 'Type is required';
        if (!form.difficulty) newErrors.difficulty = 'Difficulty is required';
        if (!form.country_origin) newErrors.country_origin = 'Country of origin is required';
        if (!form.order) newErrors.order = 'Order is required';
        if (!form.source) newErrors.source = 'Source is required';
        if (!form.preparation_time) newErrors.preparation_time = 'Preparation time is required';

        if (!form.ingredients || form.ingredients.length === 0) {
            newErrors.ingredients = 'You must complete the ingredients';
        }

        if (!form.elaboration || form.elaboration.length === 0) {
            newErrors.elaboration = 'You must complete the elaboration steps';
        }

        if (!form.link) newErrors.link = 'Link is required';
        if (!form.image) newErrors.image = 'Image is required';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSave = () => {

        if (!validateForm()) return;

        let tagsRecipe = selectedTags.map(tag => tag.name);
        const newRecipe = {
            name: form.name,
            elaboration: form.elaboration,//.join(','),
            preparation_time: parseInt(form.preparation_time),
            link: form.link,
            type: form.type,
            difficulty: form.difficulty,
            country_origin: form.country_origin,
            order: form.order,
            source: form.source,
            tag: tagsRecipe,
            image: form.image,
        };

        console.log('Formulario completado:', form);

        createNewRecipe(newRecipe);
    };

    const createNewRecipe = async (newRecipe) => {
        const resultAction = await dispatch(postNewRecipe(newRecipe));
        if (postNewRecipe.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const recipesReceive = resultAction.payload;
                console.log("RECIPE CREATED");
                console.log(recipesReceive);

                createGroupsIngredient(recipesReceive.id);

                // Reset ingredients about current recipe
                dispatch(setListCurrentIngredient([]));

                //Navigate to home
                navigate(`/recipes`);
            }
        }
    };

    const createGroupsIngredient = async (idRecipe) => {
        const listIngredientsNewRecipes = Object.values(listIngredientsNewRecipesAPI);
        // Obtener grupos únicos no vacíos
        const listGroupCreate = [...new Set(
            listIngredientsNewRecipes
                .map(item => item.group)
                .filter(group => group !== undefined && group !== null && group !== "")
        )];

        let list_group_created = []

        for (let indexGroup in listGroupCreate) {
            const resultPostGroup = await dispatch(postGroup(listGroupCreate[indexGroup]));
            if (postGroup.fulfilled.match(resultPostGroup)) {
                if (resultPostGroup.payload != undefined) {
                    const newGroupReceive = resultPostGroup.payload;
                    list_group_created.push(newGroupReceive)
                }
            }
        }
        createNewAssociationIngredientsAndRecipe(idRecipe, list_group_created)
    }

    const createNewAssociationIngredientsAndRecipe = async (idRecipe, list_group_created) => {
        const listIngredientsNewRecipes = Object.values(listIngredientsNewRecipesAPI);
        for (let index in listIngredientsNewRecipes) {
            let newRecipe = {}
            if (listIngredientsNewRecipes[index].group != "") {
                let group_ingrediente = list_group_created.filter(element => element.name == listIngredientsNewRecipes[index].group)
                newRecipe = {
                    ingredient: listIngredientsNewRecipes[index].ingredient.id,
                    cuantity: listIngredientsNewRecipes[index].quantity,
                    unit: listIngredientsNewRecipes[index].unit.id,
                    recipe: idRecipe,
                    group: group_ingrediente.length != 0 ? group_ingrediente[0].id : null,
                };
            }
            else {
                newRecipe = {
                    ingredient: listIngredientsNewRecipes[index].ingredient.id,
                    cuantity: listIngredientsNewRecipes[index].quantity,
                    unit: listIngredientsNewRecipes[index].unit.id,
                    recipe: idRecipe,
                };
            }

            const resultActionCreatedIngredient = await dispatch(postIngredientRecipe(newRecipe));
            if (postIngredientRecipe.fulfilled.match(resultActionCreatedIngredient)) {
                if (resultActionCreatedIngredient.payload != undefined) {
                    const newIngredientReceive = resultActionCreatedIngredient.payload;
                    console.log("RECIPE CREATED");
                    console.log(newIngredientReceive);
                }
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    mb: 2,
                }}
            >
                New Recipe
            </Typography>
            <Box display="flex" flexDirection="row" gap={2}>
                <Box
                    flex={showIngredients || showElaborationSteps ? 1 : 'unset'}
                    width={showIngredients || showElaborationSteps ? '50%' : '100%'}
                    pointerEvents={showIngredients || showElaborationSteps ? 'none' : 'auto'}
                    opacity={showIngredients || showElaborationSteps ? 0.5 : 1}
                    sx={{
                        pointerEvents: showIngredients || showElaborationSteps ? 'none' : '',
                        opacity: showIngredients || showElaborationSteps ? 0.5 : 1, // opcional, solo para indicar visualmente que está desactivado
                    }}
                >
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Divider sx={{ mt: 2, mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Initial information</Typography>
                        </Divider>

                        <TextField
                            label="Name"
                            value={form.name}
                            onChange={handleChange('name')}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                        />

                        <TextField
                            select
                            label="Type"
                            value={form.type}
                            onChange={handleChange('type')}
                            error={!!errors.type}
                            helperText={errors.type}
                            fullWidth
                        >
                            {listTypes.map((option) => (
                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                            ))}
                        </TextField>


                        <TextField
                            select
                            label="Difficulty"
                            value={form.difficulty}
                            onChange={handleChange('difficulty')}
                            error={!!errors.difficulty}
                            helperText={errors.difficulty}
                            fullWidth
                        >
                            {listLevels.map((option) => (
                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                            ))}
                        </TextField>

                        <Autocomplete
                            options={countries}
                            getOptionLabel={(option) => option.label}
                            value={countries.find(c => c.label === form.country_origin) || null}
                            onChange={(e, newValue) => setForm({ ...form, country_origin: newValue?.label || '' })}
                            error={!!errors.countries}
                            helperText={errors.countries}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} {...props}>
                                    <Avatar src={option.flag} alt={option.label} sx={{ width: 20, height: 20 }} />
                                    {option.label}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Country of origin"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: form.country_origin && (
                                            <Avatar
                                                src={
                                                    countries.find(c => c.label === form.country_origin)?.flag
                                                }
                                                sx={{ width: 24, height: 24, mr: 1 }}
                                            />
                                        ),
                                    }}
                                />
                            )}

                        />

                        <TextField
                            select
                            label="Order"
                            value={form.order}
                            onChange={handleChange('order')}
                            error={!!errors.order}
                            helperText={errors.order}
                            fullWidth
                        >
                            {listOrders.map((option) => (
                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Source"
                            value={form.source}
                            onChange={handleChange('source')}
                            error={!!errors.source}
                            helperText={errors.source}
                            fullWidth
                        >
                            {listSources.map((option) => (
                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                            ))}
                        </TextField>

                        <Divider sx={{ mt: 2, mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Ingredients</Typography>
                        </Divider>

                        <Button
                            //onClick={() => setShowIngredients(true)} 
                            onClick={() => {
                                setTimeout(() => setShowIngredients(true), 0);
                                dispatch(setModeWindowIngredient("new"));
                            }}
                            variant="outlined"
                            color="secondary"
                        >
                            Add ingredients
                        </Button>

                        {errors.ingredients && (
                            <Typography color="error" variant="body2">{errors.ingredients}</Typography>
                        )}

                        <Divider sx={{ mt: 2, mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Elaboration</Typography>
                        </Divider>

                        <TextField
                            label="Preparation time (min)"
                            value={form.preparation_time}
                            onChange={handleChange('preparation_time')}
                            error={!!errors.preparation_time}
                            helperText={errors.preparation_time}
                            fullWidth
                        />

                        <Button
                            //onClick={() => setShowElaborationSteps(true)}
                            onClick={() => setTimeout(() => setShowElaborationSteps(true), 0)}
                            variant="outlined"
                            color="secondary"
                        >
                            Add elaboration
                        </Button>

                        {errors.elaboration && (
                            <Typography color="error" variant="body2">{errors.elaboration}</Typography>
                        )}

                        <Divider sx={{ mt: 2, mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Additional information</Typography>
                        </Divider>

                        <TextField
                            label="Link"
                            value={form.link}
                            onChange={handleChange('link')}
                            error={!!errors.link}
                            helperText={errors.link}
                            fullWidth
                        />

                        <TextField
                            label="Image (URL)"
                            value={form.image}
                            onChange={handleChange('image')}
                            error={!!errors.image}
                            helperText={errors.image}
                            fullWidth
                        />

                        <MultiSelectAutocomplete
                            options={listTags}
                            selected={selectedTags}
                            setSelected={setSelectedTags}
                            error={!!errors.tags}
                            helperText={errors.tags}
                            label="Tags"
                        />

                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button color="secondary" variant="outlined">Cancel</Button>
                            <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                        </Box>
                    </Box>
                </Box>
                {showIngredients && (
                    <Box width="80%">
                        <AssignIngredientsPanel
                            onClose={() => setShowIngredients(false)}
                            setIdIngredients={(idIngredients) => setForm({ ...form, ingredients: idIngredients })}
                        />
                    </Box>
                )}

                {showElaborationSteps && (
                    <Box width="65%">
                        <ElaborationPanel
                            onClose={() => setShowElaborationSteps(false)}
                            setIdSteps={(steps) => setForm({ ...form, elaboration: steps })}
                        />
                    </Box>
                )}
            </Box>
        </Container>
    );
}
