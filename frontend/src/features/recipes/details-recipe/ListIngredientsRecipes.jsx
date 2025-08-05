import {
    Box,
    Typography,
    Avatar,
    Paper,
    Skeleton,
    Stack
} from '@mui/material';
import { toTitleCase } from 'src/utils/format-text'

export default function ListIngredientsRecipes({ listIngredientsRecipe }) {

    return (
        <Box width="35%">
            <Typography variant="h5" fontWeight="medium" gutterBottom>
                Ingredients
            </Typography>

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
    );

}
