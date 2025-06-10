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
import ElaborationStepsInput from '../../elaboration/ElaborationPanel';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    LOWER_LEVEL_DIFFICULTY_RECIPE,
    MEDIUM_LEVEL_DIFFICULTY_RECIPE,
    HIGH_LEVEL_DIFFICULTY_RECIPE,
    ORDER_MEAL,
    ORDER_BREAKFAST_SNACK,
    ORDER_BASIC,
    ORDER_DIP,
    ORDER_ACCOMPANIMENT,
    ORDER_DESSERT,
    SOURCE_TIKTOK,
    SOURCE_INSTAGRAM,
    SOURCE_MASTER_CHEF,
    SOURCE_BOOK,
    SOURCE_OTHER,
} from 'src/utils/constant';

import { getAllTypesRecipes } from '../../../redux/type/actions'
import IngredientsPanel from '../../ingredients/IngredientsPanel';
import ElaborationPanel from '../../elaboration/ElaborationPanel';
import { setListIngredientsNewRecipe } from '../../../redux/recipe/actions'

const difficulties = [LOWER_LEVEL_DIFFICULTY_RECIPE, MEDIUM_LEVEL_DIFFICULTY_RECIPE, HIGH_LEVEL_DIFFICULTY_RECIPE];
const tags = ['Vegetariano', 'Vegano', 'Sin gluten'];
const order = [ORDER_MEAL, ORDER_BREAKFAST_SNACK, ORDER_BASIC, ORDER_DIP, ORDER_ACCOMPANIMENT, ORDER_DESSERT];
const source = [SOURCE_TIKTOK, SOURCE_INSTAGRAM, SOURCE_MASTER_CHEF, SOURCE_BOOK, SOURCE_OTHER];


export default function RecipeFormPage() {

    const location = useLocation();
    const dispatch = useDispatch();

    const [countries, setCountries] = useState([]);
    const [listTypes, setListTypes] = useState([]);
    const [showIngredients, setShowIngredients] = useState(false);
    const [showElaborationSteps, setShowElaborationSteps] = useState(false);

    const [form, setForm] = useState({
        name: '',
        elaboration: [''],
        preparation_time: '',
        link: '',
        type: '',
        difficulty: difficulties[0],
        country_origin: countries[0],
        order: '',
        source: '',
        tags: tags[0],
        image: '',
        type_name: '',
    });

    useEffect(() => {
        getListTypesRecipes();
        getListCountries();
    }, [location.pathname]);

    const getListCountries = () => {
        fetch('https://restcountries.com/v3.1/all')
            .then(res => res.json())
            .then(data => {
                if (data.status != 400) {
                    const formatted = data?.map((c) => ({
                        label: c.name.common,
                        flag: c.flags?.svg || c.flags?.png,
                    })).sort((a, b) => a.label.localeCompare(b.label));
                    setCountries(formatted);
                    const posSpain = formatted.find(element => element.label === "Spain");
                    setForm(prev => ({ ...prev, country_origin: posSpain?.label || '' }));

                }
            });
    }

    const getListTypesRecipes = async () => {
        const resultAction = await dispatch(getAllTypesRecipes());
        if (getAllTypesRecipes.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const listTypeRecipesReceive = Object.values(resultAction.payload);
                setListTypes(listTypeRecipesReceive);

                if (listTypeRecipesReceive.length > 0) {
                    setForm(prev => ({
                        ...prev,
                        type: listTypeRecipesReceive[0].name // o .id si usas ID como value
                    }));
                }
            }
        }
    };


    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSave = () => {
        console.log('Formulario completado:', form);

        // Reset ingredients about current recipe
        //dispatch(setListIngredientsNewRecipe([]));
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

                        <TextField label="Nombre" value={form.name} onChange={handleChange('name')} fullWidth />

                        <TextField select label="Type" value={form.type} onChange={handleChange('type')} fullWidth>
                            {listTypes.map((option) => (
                                <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField select label="Dificultad" value={form.difficulty} onChange={handleChange('difficulty')} fullWidth>
                            {difficulties.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>

                        <Autocomplete
                            options={countries}
                            getOptionLabel={(option) => option.label}
                            value={countries.find(c => c.label === form.country_origin) || null}
                            onChange={(e, newValue) => setForm({ ...form, country_origin: newValue?.label || '' })}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} {...props}>
                                    <Avatar src={option.flag} alt={option.label} sx={{ width: 20, height: 20 }} />
                                    {option.label}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="País de origen"
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

                        <TextField select label="Order" value={form.order} onChange={handleChange('order')} fullWidth>
                            {order.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>

                        <TextField select label="Source" value={form.source} onChange={handleChange('source')} fullWidth>
                            {source.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>

                        <Divider sx={{ mt: 2, mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Ingredients</Typography>
                        </Divider>

                        <Button onClick={() => setShowIngredients(true)} variant="outlined" color="secondary">
                            Add ingredients
                        </Button>

                        <Divider sx={{ mt: 2, mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Elaboration</Typography>
                        </Divider>

                        <TextField
                            label="Tiempo de preparación (min)"
                            value={form.preparation_time}
                            onChange={handleChange('preparation_time')}
                            fullWidth
                        />

                        <Button onClick={() => setShowElaborationSteps(true)} variant="outlined" color="secondary">
                            Add elaboration
                        </Button>

                        <Divider sx={{ mt: 2, mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Additional information</Typography>
                        </Divider>

                        <TextField label="Link" value={form.link} onChange={handleChange('link')} fullWidth />
                        <TextField label="Imagen (URL)" value={form.image} onChange={handleChange('image')} fullWidth />

                        <TextField select label="Tags" value={form.tags} onChange={handleChange('tags')} fullWidth>
                            {tags.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>

                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button color="secondary" variant="outlined">Cancelar</Button>
                            <Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
                        </Box>
                    </Box>
                </Box>
                {showIngredients && (
                    <Box width="65%">
                        <IngredientsPanel 
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
