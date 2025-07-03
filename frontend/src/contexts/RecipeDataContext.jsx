// RecipeDataContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllTypesRecipes } from '../redux/type/actions';
import { getAllOrders } from '../redux/orders/actions';
import { getAllLevels } from '../redux/levels/actions';
import { getAllSources } from '../redux/sources/actions';
import { getAllTags } from '../redux/tags/actions';
import { getAllRecipes } from '../redux/recipe/actions';

import { getAllUnits } from '../redux/units/actions';
import { getAllIngredients } from '../redux/ingredients/actions';

const RecipeDataContext = createContext();

export const RecipeDataProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [listTypes, setListTypes] = useState([]);
  const [listOrders, setListOrders] = useState([]);
  const [listLevels, setListLevels] = useState([]);
  const [listSources, setListSources] = useState([]);
  const [listTags, setListTags] = useState([]);
  const [listRecipes, setListRecipes] = useState([]);
  const [listUnits, setListUnits] = useState([]);
  const [listIngredients, setListIngredients] = useState([]);

  const fetchData = async () => {
    const [typesRes, ordersRes, levelsRes, sourcesRes, tagsRes, recipesRes, unitsRes, ingredientsRes] = await Promise.all([
      dispatch(getAllTypesRecipes()),
      dispatch(getAllOrders()),
      dispatch(getAllLevels()),
      dispatch(getAllSources()),
      dispatch(getAllTags()),
      dispatch(getAllRecipes()),
      dispatch(getAllUnits()),
      dispatch(getAllIngredients()),
    ]);

    if (getAllTypesRecipes.fulfilled.match(typesRes)) setListTypes(typesRes.payload);
    if (getAllOrders.fulfilled.match(ordersRes)) setListOrders(ordersRes.payload);
    if (getAllLevels.fulfilled.match(levelsRes)) setListLevels(levelsRes.payload);
    if (getAllSources.fulfilled.match(sourcesRes)) setListSources(sourcesRes.payload);
    if (getAllTags.fulfilled.match(tagsRes)) setListTags(tagsRes.payload);
    if (getAllRecipes.fulfilled.match(recipesRes)) setListRecipes(recipesRes.payload);
    if (getAllUnits.fulfilled.match(unitsRes)) setListUnits(unitsRes.payload);
    if (getAllIngredients.fulfilled.match(ingredientsRes)) setListIngredients(ingredientsRes.payload);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <RecipeDataContext.Provider
      value={{
        listRecipes,
        listTypes,
        listOrders,
        listLevels,
        listSources,
        listTags,
        listUnits,
        listIngredients,
        refreshData: fetchData,
      }}
    >
      {children}
    </RecipeDataContext.Provider>
  );
};

export const useRecipeData = () => useContext(RecipeDataContext);
