import {
    Box,
    Typography,
    Avatar,
    Skeleton,
} from '@mui/material';

export default function ListStepsRecipes({ recipe, setEditSteps }) {

    return (
        <Box width="65%">
            <Typography variant="h5" fontWeight="medium" gutterBottom>
                Elaboration
            </Typography>
            <Box component="ol" sx={{ pl: 3 }}>
                {recipe ? (
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {recipe?.elaboration?.map((step, idx) => (
                            <Box
                                component="li"
                                key={idx}
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
                        <li key={i}>
                            <Skeleton width="90%" />
                        </li>
                    ))
                )}
            </Box>
        </Box>
    );

}
