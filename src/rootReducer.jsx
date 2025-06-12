import {combineReducers} from "redux";
import recipeReducer from "./redux/recipe/reducer";
import typeRecipesReducer from "./redux/type/reducer";
import ingredientsReducer from "./redux/ingredients/reducer";
import unitsReducer from "./redux/units/reducer";
import sourcesReducer from "./redux/sources/reducer";
import tagsReducer from "./redux/tags/reducer";
import levelsReducer from "./redux/levels/reducer";
import ordersReducer from "./redux/orders/reducer";

const rootReducer = combineReducers({
    recipesComponent: recipeReducer,
    typeRecipesComponent: typeRecipesReducer,
    ingredientsComponent: ingredientsReducer,
    unitsComponent: unitsReducer,
    sourcesComponent: sourcesReducer,
    tagsComponent: tagsReducer,
    levelsComponent: levelsReducer,
    ordersComponent: ordersReducer,
});

export default rootReducer