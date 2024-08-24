const ADD_IMG = 'posts/addimage';


const addPost = (post) => ({
    type: ADD_IMG,
    payload: post
});


export const createImage = (post) => async (dispatch) => {
    const response = await fetch(`/api/images/`, {
      method: "POST",
      body: post
    });
  
    if (response.ok) {
        const resPost  = await response.json();
        // console.log('RES POST ???',resPost)
        dispatch(addPost(resPost));
    } else {
        console.log("There was an error making your post!")
    }
};

const initalState = {img:null}
export default function imageReducer(state=initalState, action){
    switch (action.type) {
        // case GET_POST: {
        //     return {...state, post:action.payload}
        // }
        case ADD_IMG: {
            return {
                ...state,
                img:action.payload
            }
            // const newState = {...state}
            // newState.post[action.payload.id] = action.payload
            // return newState
        }
        // case UPDATE_POST: {
        //     const newState = {...state}
        //     newState.post = state.post.map(el => el.id === action.payload.id ? action.payload: el )
        //     return newState;
        // }
        // case DELETE_POST: {
        //     let newState = {...state}
        //     delete newState[action.payload];
        //     newState.post = state.post.filter(el => el.id !== action.payload)
        //     return newState;
        // }
        default:
            return state
    }
}