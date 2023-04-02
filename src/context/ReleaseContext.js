import createDataContext from "./createDataContext";
import releaseInfo from "../api/releaseInfo";
import { expo } from "../../app.json";

const releaseReducer = (state, action) => {
    switch(action.type) {
        case 'get_releaseinfo':
            return action.payload;
        default:
            return state;
    }
};

const getReleaseInfo = dispatch => {
    return async () => {
        const response = await releaseInfo.get('/release/release_info.json', {headers:{'Cache-Control':'no-cache'}});
        dispatch({ type: 'get_releaseinfo', payload: { ...response.data, update: Number(response.data.release) > Number(expo.version) } });
    }
};

export const { Context, Provider } = createDataContext(
    releaseReducer,
    { getReleaseInfo },
    []
)