import {
    postGroup,
    deleteGroup
} from 'src/redux/groups/actions'

export const postNewGroup = async (nameNewGroup, dispatch) => {
    const resultPostGroup = await dispatch(postGroup(nameNewGroup));
    if (postGroup.fulfilled.match(resultPostGroup)) {
        if (resultPostGroup.payload != undefined) {
            const newGroupReceive = resultPostGroup.payload;
            return newGroupReceive
        }
    }
}

export const removeGroup = async (idGroup, dispatch) => {
    const resultDeleteGroup = await dispatch(deleteGroup(idGroup));
    if (deleteGroup.fulfilled.match(resultDeleteGroup)) {
        if (resultDeleteGroup.payload != undefined) {
            const idGroupReceive = resultDeleteGroup.payload;
            return idGroupReceive
        }
    }
}