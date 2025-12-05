import {
    getAllUnits,
    postUnit
} from 'src/redux/units/actions'

export const getUnits = async (dispatch) => {
    const resultAction = await dispatch(getAllUnits());
    if (getAllUnits.fulfilled.match(resultAction)) {
        if (resultAction.payload != undefined) {
            const listUnitReceive = Object.values(resultAction.payload);
            return listUnitReceive
        }
    }
};
export const postNewUnit = async (name_unit, dispatch) => {
    const resultAction = await dispatch(postUnit(name_unit));
    if (postUnit.fulfilled.match(resultAction)) {
        if (resultAction.payload != undefined) {
            const newUnitReceive = Object.values(resultAction.payload);
            return newUnitReceive
        }
    }
};