const GET_POST = 'posts/getpost';
const ADD_POST = 'posts/addpost';
const UPDATE_POST = 'posts/updatepost';
const DELETE_POST = 'posts/deletepost';

const getPosts = (posts) => ({
    type: GET_POST,
    payload: posts
})

const addPost = (post) => ({
    type: ADD_POST,
    payload: post
});

const updatePost = (post) => ({
    type: UPDATE_POST,
    payload: post
})

const deletePost = (id) => ({
    type:DELETE_POST,
    payload: id
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

export const thunkCreatePost = (post) => async(dispatch) => {
    const {text, img, selectedTag} = post
    console.log('img in thunk', img)
    // console.log('TAG from', tags)
    // const allTags = await fetch('/api/labels/');
    // console.log('tags all from Tag table backend', allTags)
    // if(allTags.ok){
    //     const tagsData = await allTags.json()
    //     // console.log(tagsData) array with id and name obj
    //     // tagsData.find(tag => )
    // }
    const res = await fetch('/api/posts/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post)
    });
    if (res.ok) {
        const data = await res.json()
        dispatch(addPost(data))
        return {data}
    }else {
        const errorData = await res.json()
        return {errors: errorData}
    }
}

export const thunkUpdatePost = (post) => async(dispatch) => {
    const {text, post_id, img} = post
    const res = await fetch(`/api/posts/${post_id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post)
    });
    if (res.ok) {
        const data = await res.json()
        dispatch(updatePost(data))
        return {data}
    }else {
        const errorData = await res.json()
        return {errors: errorData}
    }
}

export const thunkDeletePost = (id) => async(dispatch) => {
    const res = await fetch(`/api/posts/${id}`, {
        method:'DELETE'
    });
    if (res.ok) {
        dispatch(deletePost(id));
        return;
    }
}


const initalState = {}
export default function postReducer(state=initalState, action){
    switch (action.type) {
        case GET_POST: {
            return {...state, post:action.payload}
        }
        case ADD_POST: {
            return {
                ...state,
                post:[...state.post, action.payload]
            }
            // const newState = {...state}
            // newState.post[action.payload.id] = action.payload
            // return newState
        }
        case UPDATE_POST: {
            const newState = {...state}
            newState.post = state.post.map(el => el.id === action.payload.id ? action.payload: el )
            return newState;
        }
        case DELETE_POST: {
            let newState = {...state}
            delete newState[action.payload];
            newState.post = state.post.filter(el => el.id !== action.payload)
            return newState;
        }
        default:
            return state
    }
}