import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import Typography from '@mui/material/Typography';
import RecipeCard from '../recipes/components/recipes-card';

const Dashboard = () => {
  const navigate = useNavigate();

  const [listRecipes, setListRecipes] = useState([]);

  useEffect(() => {
  }, []);


  const handleClick = (recipe) => {
    // Redirigir a la URL específica del recipeo
    navigate(`/recipes/${recipe._id}`);
  };

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            {listRecipes.map((recipe) => (
              <>
                <Typography variant="h6" sx={{ color: 'text.secondary'}}>
                  {recipe['brand']}
                </Typography>
                <Grid container direction="row" spacing={3}>
                  {recipe['list'].map((recipe) => (
                    <Grid
                      key={recipe.id}
                      xs={12}
                      sm={6}
                      md={2}
                      onClick={(e) => handleClick(recipe)}
                    >
                      <RecipeCard key={recipe._id} recipe={recipe} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ))}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
