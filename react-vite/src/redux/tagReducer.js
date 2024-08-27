const GET_TAG = 'tags/gettags'

const getTags = (tag) => ({
    type: GET_TAG,
    payload: tag
})

export const thunkGetTags = () => async(dispatch) => {
    const res = await fetch('/api/labels/')
    console.log('!!!!!!!!!!!!!!!!',res)
    if(res.ok){
        const data = await res.json()
        dispatch(getTags(data))
        return data
    }else {
        const errorData = await res.json()
        return {errors: errorData.errors}
    }
}

const initalState = {}
export default function tagReducer(state=initalState, action){
    switch(action.type){
        case GET_TAG: {
            return {...state, tag:action.payload}
        }
        default:
            return state
    }
}