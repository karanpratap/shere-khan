import createDataContext from "./createDataContext";
import jsonServer from "../api/jsonServer";

const pricesReducer = (state, action) => {
    switch(action.type) {
        case 'get_prices':
            return action.payload;
        case 'edit_prices':    
            return state.map((item) => {
                return item.id === action.payload.id ? action.payload : item    
            });
        default:
            return state;
    }
};

const getPrices = dispatch => {
    return async () => {
        const response = await jsonServer.get('/prices');
        dispatch({ type: 'get_prices', payload: response.data });
    }
};

const editPrices = dispatch => {
    return async (item, price, id, callback) => {
        // WRITE THE MAGIC LOGIC HERE
        await jsonServer.put(`/prices/${id}`, { item, price });
        dispatch({
            type: 'edit_prices',
            payload: { id, item, price }
        });
        callback();
    }
}

export const { Context, Provider } = createDataContext(
    pricesReducer,
    { editPrices, getPrices },
    []
)