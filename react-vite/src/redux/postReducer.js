const GET_POST = 'posts/getpost';

const getPosts = (post) => ({
    type: GET_POST,
    payload: post
})

export const thunkGetPosts = () => async(dispatch) => {
    const res = await fetch('/api/posts')
    // console.log('get data back?', res)
    if (res.ok){
        const data = await res.json()
        dispatch(getPosts(data))
    }else {
        const errorData = await res.json()
        return {errors: errorData.errors}
    }
}

const initalState = {}
export default function postReducer(state=initalState, action){
    switch (action.type) {
        case GET_POST: {
            return {...state, post:action.payload}
        }
        default:
            return state
    }
}