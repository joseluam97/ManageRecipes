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
    Chip,
    Grid,
    Skeleton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRecipeData } from 'src/contexts/RecipeDataContext';
import MultiSelectAutocomplete from 'src/components/selectors/MultiSelectAutocomplete'
import { putRecipe } from 'src/redux/recipe/actions'

export default function EditDetailsRecipe({ recipe, countries, setEditRecipe }) {

    const location = useLocation();
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState([]);

    const { listTypes, listOrders, listLevels, listSources, listTags } = useRecipeData();

    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        name: '',
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
        if (recipe != undefined) {
            // Get tags about recipe
            let list_tag = []
            for (const tag_name of recipe?.tag) {
                let object_tag = listTags.filter(element => element.name == tag_name)[0]
                if (object_tag != undefined) {
                    list_tag.push(object_tag)
                }
            }
            setSelectedTags(list_tag)
            let complete_data_form = {
                name: recipe?.name,
                type: recipe?.type?.id,
                difficulty: recipe?.difficulty?.id,
                country_origin: recipe?.country_origin,
                preparation_time: recipe?.preparation_time,
                order: recipe?.order?.id,
                source: recipe?.source?.id,
                link: recipe?.link,
                image: recipe?.image,
            }
            setForm(complete_data_form)
        }
    }, [location.pathname, recipe]);

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
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

        if (!form.link) newErrors.link = 'Link is required';
        if (!form.image) newErrors.image = 'Image is required';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {

        if (!validateForm()) return;

        let tagsRecipe = selectedTags.map(tag => tag.name);
        const updateRecipe = {
            id: recipe?.id,
            name: form.name,
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

        updateElaborationRecipe(updateRecipe);
        setEditRecipe(false);
    };

    const updateElaborationRecipe = async (new_elaboration) => {
        const resultAction = await dispatch(putRecipe(new_elaboration));
        if (putRecipe.fulfilled.match(resultAction)) {
            if (resultAction.payload != undefined) {
                const recipesReceive = resultAction.payload;
                console.log("RECIPE UPDATE");
                console.log(recipesReceive);
            }
        }
    };

    const handleCancel = () => {
        setEditRecipe(false);
    };

    return (
        <Grid item xs={12} md={12}>

            <Grid container spacing={2}>

                <Grid item xs={12} key={1}>
                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={handleChange('name')}
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={6} key={1}>
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
                </Grid>

                <Grid item xs={6} key={2}>
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
                </Grid>

                <Grid item xs={6} key={3}>
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
                </Grid>

                <Grid item xs={6} key={4}>
                    <TextField
                        label="Preparation time (min)"
                        value={form.preparation_time}
                        onChange={handleChange('preparation_time')}
                        error={!!errors.preparation_time}
                        helperText={errors.preparation_time}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={6} key={4}>
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
                </Grid>

                <Grid item xs={6} key={4}>
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
                </Grid>

                <Grid item xs={6} key={4}>
                    <TextField
                        label="Link"
                        value={form.link}
                        onChange={handleChange('link')}
                        error={!!errors.link}
                        helperText={errors.link}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={6} key={4}>
                    <TextField
                        label="Image (URL)"
                        value={form.image}
                        onChange={handleChange('image')}
                        error={!!errors.image}
                        helperText={errors.image}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} key={4}>
                    <MultiSelectAutocomplete
                        options={listTags}
                        selected={selectedTags}
                        setSelected={setSelectedTags}
                        error={!!errors.tags}
                        helperText={errors.tags}
                        label="Tags"
                    />
                </Grid>

                <Grid item xs={12} key={4}>
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <Button onClick={handleCancel} color="secondary" variant="outlined">Cancel</Button>
                        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );

}
