import {combineReducers} from "redux";
import recipeReducer from "./redux/recipe/reducer";

const rootReducer = combineReducers({
    recipesComponent: recipeReducer,
});

export default rootReducer