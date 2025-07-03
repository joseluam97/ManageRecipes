import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';
import { RecipeDataProvider } from './contexts/RecipeDataContext';
import { baselightTheme } from "./theme/DefaultColors";

function App() {
  const routing = useRoutes(Router);
  const theme = baselightTheme;
  return (
    <ThemeProvider theme={theme}>

      <CssBaseline />
      <RecipeDataProvider>
        {routing}
      </RecipeDataProvider>

    </ThemeProvider>
  );
}

export default App;
