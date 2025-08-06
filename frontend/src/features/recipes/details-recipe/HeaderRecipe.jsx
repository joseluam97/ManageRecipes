import {
    Box,
    Button,
    Grid,
    Skeleton,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import Menu1 from 'src/assets/images/menu/menu1.jpg';
import { Edit } from '@mui/icons-material';

export default function HeaderRecipe({ recipe }) {

    return (
        <Grid item xs={12} md={4}>
            {recipe ? (
                <Box
                    component="img"
                    src={Menu1}
                    alt={recipe?.name}
                    sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
                />
            ) : (
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
            )}
            {recipe ? (
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<Edit />}
                    href={recipe?.link}
                    target="_blank"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Edit
                </Button>
            ) : (
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 1 }} />
            )}
            {recipe?.link ? (
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<LaunchIcon />}
                    href={recipe?.link}
                    target="_blank"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Visit Link
                </Button>
            ) : (
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 1 }} />
            )}
        </Grid>
    );

}
