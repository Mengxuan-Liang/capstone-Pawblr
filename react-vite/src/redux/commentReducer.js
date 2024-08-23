const GET_COMMENT = 'comments/getcomments';
const ADD_COMMENT = 'comments/addcomments'

const getComments = (comment) => ({
    type: GET_COMMENT,
    payload:comment
})

const addComments = (comment) => ({
    type: ADD_COMMENT,
    payload: comment
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

export const thunkAddComments = (comment) => async(dispatch) => {
    const {text, post_id} = comment
    const res = await fetch(`/api/comments/${post_id}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           text
        })
    });
    if(res.ok){
        const data = await res.json()
        dispatch(addComments(data))
        return data
    }else {
        const errorData = await res.json()
        return {errors: errorData}
    }
}

const initalState = {}
export default function commentReducer(state=initalState, action){
    switch (action.type) {
        case GET_COMMENT: {
            return {...state, comment:action.payload}
        }
        case ADD_COMMENT: {
            return {
                ...state,
                comment:[...state.comment, action.payload]
            }
          
        }
        default:
            return state
    }
}