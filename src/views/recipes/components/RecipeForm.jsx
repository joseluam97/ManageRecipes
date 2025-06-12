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
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    COUNTRY_DEFAULT
} from 'src/utils/constant';

import { getAllTypesRecipes } from '../../../redux/type/actions'
import IngredientsPanel from '../../ingredients/IngredientsPanel';
import ElaborationPanel from '../../elaboration/ElaborationPanel';
import MultiSelectAutocomplete from '../../../components/selectors/MultiSelectAutocomplete'

import { getAllTags } from '../../../redux/tags/actions'
import { getAllOrders } from '../../../redux/orders/actions'
import { getAllSources } from '../../../redux/sources/actions'
import { getAllLevels } from '../../../redux/levels/actions'
import { getListCountries } from '../../../utils/countries'

export default function RecipeFormPage() {

    const location = useLocation();
    const dispatch = useDispatch();

    const [countries, setCountries] = useState([]);
    const [listTypes, setListTypes] = useState([]);

    const [listTags, setListTags] = useState([]);
    const [listOrders, setListOrders] = useState([]);
    const [listSources, setListSources] = useState([]);
    const [listLevels, setListLevels] = useState([]);

    const [selectedTags, setSelectedTags] = useState([]);

    const [showIngredients, setShowIngredients] = useState(false);
    const [showElaborationSteps, setShowElaborationSteps] = useState(false);

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
        if (selectedTags != undefined) {
            setForm({ ...form, ['tags']: selectedTags.map(tag => tag.name).join(', ') });
        }

    }, [selectedTags]);

    useEffect(() => {
        getListTypesRecipes();

        getOrders();
        getSources();
        getLevels();
        getTags();

        // Get list Countries
        fetchCountries();

    }, [location.pathname]);

    const fetchCountries = async () => {
        const listCountries = await getListCountries();

        setCountries(listCountries);
        const posSpain = listCountries.find(element => element.label === COUNTRY_DEFAULT);
        setForm(prev => ({ ...prev, country_origin: posSpain?.label || '' }));
    };

    const getOrders = async () => {
        const resultAction = await dispatch(getAllOrders());
        if (getAllOrders.fulfilled.match(resultAction) && resultAction.payload != undefined) {
            const listOrdersReceive = Object.values(resultAction.payload);
            console.log("-listOrdersReceive-")
            console.log(listOrdersReceive)
            setListOrders(listOrdersReceive);
        }
    };

    const getSources = async () => {
        const resultAction = await dispatch(getAllSources());
        if (getAllSources.fulfilled.match(resultAction) && resultAction.payload != undefined) {
            const listSourcesReceive = Object.values(resultAction.payload);
            console.log("-listSourcesReceive-")
            console.log(listSourcesReceive)
            setListSources(listSourcesReceive);
        }
    };

    const getLevels = async () => {
        const resultAction = await dispatch(getAllLevels());
        if (getAllLevels.fulfilled.match(resultAction) && resultAction.payload != undefined) {
            const listLevelsReceive = Object.values(resultAction.payload);
            console.log("-listLevelsReceive-")
            console.log(listLevelsReceive)
            setListLevels(listLevelsReceive);
        }
    };

    const getTags = async () => {
        const resultAction = await dispatch(getAllTags());
        if (getAllTags.fulfilled.match(resultAction) && resultAction.payload != undefined) {
            const listTagsReceive = Object.values(resultAction.payload);
            console.log("-listTagsReceive-")
            console.log(listTagsReceive)
            setListTags(listTagsReceive);
        }
    };

    const getListTypesRecipes = async () => {
        const resultAction = await dispatch(getAllTypesRecipes());
        if (getAllTypesRecipes.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const listTypeRecipesReceive = Object.values(resultAction.payload);
                setListTypes(listTypeRecipesReceive);
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
                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField select label="Difficulty" value={form.difficulty} onChange={handleChange('difficulty')} fullWidth>
                            {listLevels.map((option) => (
                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
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

                        <TextField select label="Order" value={form.order} onChange={handleChange('order')} fullWidth>
                            {listOrders.map((option) => (
                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField select label="Source" value={form.source} onChange={handleChange('source')} fullWidth>
                            {listSources.map((option) => (
                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
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
                            label="Preparation time (min)"
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
                        <TextField label="Image (URL)" value={form.image} onChange={handleChange('image')} fullWidth />

                        <MultiSelectAutocomplete
                            options={listTags}
                            selected={selectedTags}
                            setSelected={setSelectedTags}
                            label="Tags"
                        />

                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button color="secondary" variant="outlined">Cancel</Button>
                            <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
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
