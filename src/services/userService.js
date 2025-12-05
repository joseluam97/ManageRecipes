import {
    getUserValidate,
    postUnit
} from 'src/redux/users/actions'
import { useSelector } from 'react-redux';

export const getUserLogin = async (email, password, dispatch) => {
    const resultAction = await dispatch(getUserValidate({ email, password }));
    if (getUserValidate.fulfilled.match(resultAction)) {
        if (resultAction.payload != undefined) {
            const data_user_validate = resultAction.payload;
            return data_user_validate
        }
    }
};

export const useIsUserLoggedIn = () => { 
    // Ahora, useSelector se llama dentro de un Hook válido
    const data_user_login = useSelector((state) => state.userComponent.userLogin);

    // La función simplemente retorna un booleano basado en el estado
    return data_user_login !== undefined && data_user_login !== null;
};