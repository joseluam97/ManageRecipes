import {combineReducers} from "redux";
import recipeReducer from "./redux/recipe/reducer";
import typeRecipesReducer from "./redux/type/reducer";

const rootReducer = combineReducers({
    recipesComponent: recipeReducer,
    typeRecipesComponent: typeRecipesReducer,
});

export default rootReducer