const GET_COMMENT = 'comments/getcomments';
const ADD_COMMENT = 'comments/addcomments';
const DELETE_COMMENT = 'comments/deletecomments'

const getComments = (comment) => ({
    type: GET_COMMENT,
    payload:comment
})

const addComments = (comment) => ({
    type: ADD_COMMENT,
    payload: comment
})

const deleteComment = (id) => ({
    type: DELETE_COMMENT,
    payload:id
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

export const thunkDeleteComment = (id) => async(dispatch) => {
    const res = await fetch(`/api/comments/${id}`,{
        method:'DELETE'
    });
    if(res.ok){
        dispatch(deleteComment(id))
        return await res.json()
    }else {
        const errorData = await res.json()
        return {deleteErrors: errorData}
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
        case DELETE_COMMENT: {
            let newState = {...state}
            delete newState[action.id]
            newState.comment = state.comment.filter(el => el.id !== action.payload)
            return newState;
        }
        default:
            return state
    }
}