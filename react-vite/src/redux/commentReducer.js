const GET_COMMENT = 'comments/getcomments';

const getComments = (comment) => ({
    type: GET_COMMENT,
    payload:comment
})

export const thunkGetComments = () => async(dispatch) => {
    const res = await fetch(`/api/comments/`)
    if (res.ok){
        const data = await res.json()
        dispatch(getComments(data))
    }else {
        const errorData = await res.json()
        return {errors: errorData.errors}
    }
}

const initalState = {}
export default function commentReducer(state=initalState, action){
    switch (action.type) {
        case GET_COMMENT: {
            return {...state, comment:action.payload}
        }
        default:
            return state
    }
}