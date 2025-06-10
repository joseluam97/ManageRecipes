import {combineReducers} from "redux";
import recipeReducer from "./redux/recipe/reducer";
import typeRecipesReducer from "./redux/type/reducer";
import ingredientsReducer from "./redux/ingredients/reducer";
import unitsReducer from "./redux/units/reducer";

const rootReducer = combineReducers({
    recipesComponent: recipeReducer,
    typeRecipesComponent: typeRecipesReducer,
    ingredientsComponent: ingredientsReducer,
    unitsComponent: unitsReducer,
});

export default rootReducer