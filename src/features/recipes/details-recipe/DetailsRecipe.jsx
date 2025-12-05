import {
    Box,
    Typography,
    Avatar,
    Chip,
    Grid,
    Skeleton,
    Stack,
    IconButton
} from '@mui/material';
import { Edit } from '@mui/icons-material';

export default function DetailsRecipe({ recipe, countries, setEditRecipe }) {

    const editRecipe = () => {
        setEditRecipe(true)
    }
    
    return (
        <Grid item xs={12} md={8}>
            {recipe ? (
                <Stack direction="row" flexShrink={0} sx={{ my: 0, width: '100%' }} justifyContent="flex-start" alignItems="center">
                    <Typography variant="h4" fontWeight="bold" gutterBottom>{recipe.name}</Typography>
                    <IconButton onClick={editRecipe} color="primary">
                        <Edit />
                    </IconButton>
                </Stack>
            ) : (
                <Skeleton width="60%" height={40} />
            )}

            <Grid container spacing={2}>

                <Grid item xs={6} key={1}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Type
                    </Typography>
                    {recipe ? (
                        <Typography>{recipe?.type?.name}</Typography>
                    ) : (
                        <Skeleton width="80%" />
                    )}
                </Grid>

                <Grid item xs={6} key={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Difficulty
                    </Typography>
                    {recipe ? (
                        <Typography>{recipe?.difficulty?.name}</Typography>
                    ) : (
                        <Skeleton width="80%" />
                    )}
                </Grid>

                <Grid item xs={6} key={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Country of origin
                    </Typography>
                    {recipe ? (
                        <Box display="flex" gap={1}>
                            <Avatar
                                src={
                                    countries.find(c => c.label === recipe.country_origin)?.flag
                                }
                                sx={{ width: 24, height: 24, mr: 1 }}
                            />
                            <Typography>{recipe?.country_origin}</Typography>
                        </Box>
                    ) : (
                        <Skeleton width="80%" />
                    )}
                </Grid>

                <Grid item xs={6} key={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Preparation time
                    </Typography>
                    {recipe ? (
                        <Typography>{recipe?.preparation_time ? `${recipe?.preparation_time} min` : ''}</Typography>
                    ) : (
                        <Skeleton width="80%" />
                    )}
                </Grid>

                <Grid item xs={6} key={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Order
                    </Typography>
                    {recipe ? (
                        <Typography>{recipe?.order?.name}</Typography>
                    ) : (
                        <Skeleton width="80%" />
                    )}
                </Grid>

                <Grid item xs={6} key={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Source
                    </Typography>
                    {recipe ? (
                        <Typography>{recipe?.source?.name}</Typography>
                    ) : (
                        <Skeleton width="80%" />
                    )}
                </Grid>

            </Grid>

            {recipe ? (
                <Box mt={3}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Tags
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {recipe.tag.map((tag, idx) => (
                            <Chip
                                key={idx}
                                label={tag}
                            />
                        ))}
                    </Box>
                </Box>
            ) : (
                <Box mt={3}>
                    <Skeleton width="20%" />
                    <Box display="flex" gap={1} mt={1}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rounded" width={60} height={32} />
                        ))}
                    </Box>
                </Box>
            )}
        </Grid>
    );

}
