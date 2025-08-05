import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/Dashboard')))
const Recipes = Loadable(lazy(() => import('../pages/recipes/ListRecipesPage')))
const Ingredients = Loadable(lazy(() => import('../pages/ingredients/IngredientsPage')))
const RecipeView = Loadable(lazy(() => import('../pages/recipes/DetailsRecipePage')))
const RecipeForm = Loadable(lazy(() => import('../pages/recipes/RecipeForm')))
const Error = Loadable(lazy(() => import('../pages/authentication/Error')));
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/ingredients', exact: true, element: <Ingredients /> },
      { path: '/recipes', exact: true, element: <Recipes /> },
      { path: '/recipe/:id', exact: true, element: <RecipeView /> },
      { path: '/recipesForm', exact: true, element: <RecipeForm /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
