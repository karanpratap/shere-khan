import createDataContext from "./createDataContext";
import jsonServer from "../api/jsonServer";
import calculateNutritionAmount from "../api/calculator";

const reportReducer = (state, action) => {
    switch(action.type) {
        case 'get_reports':
            return action.payload;
        case 'edit_report':    
            return state.map((report) => {
                return report.id === action.payload.id ? action.payload : report    
            });
        case 'delete_report':
            return state.filter(report => {return report.id !== action.payload});
        case 'add_report':
            return [...state, { 
                name: action.payload.name, 
                days: action.payload.days, 
                pregnantCount: action.payload.pregnantCount,  
                sixtothreeCount: action.payload.sixtothreeCount,
                threetosixCount: action.payload.threetosixCount
            }];
        default:
            return state;
    }
};

const getReports = dispatch => {
    return async () => {
        const response = await jsonServer.get('/reports');
        dispatch({ type: 'get_reports', payload: response.data });
    }
};

const addReport = () => {
    return async (name, days, pregnantCount, sixtothreeCount, threetosixCount, prices, callback) => {
        // WRITE THE MAGIC LOGIC HERE
        const results = calculateNutritionAmount({ name, days, pregnantCount, sixtothreeCount, threetosixCount }, true, prices);
        await jsonServer.post('/reports', {name, days, pregnantCount, sixtothreeCount, threetosixCount, results});
        // dispatch({type: 'add_blogpost', payload: {title, content}});
        callback();
    };
};

const deleteReport = dispatch => {
    return async (id) => {
        await jsonServer.delete(`/reports/${id}`);
        dispatch({type: 'delete_report', payload: id});
    }
}

const editReport = dispatch => {
    return async (name, days, pregnantCount, sixtothreeCount, threetosixCount, id, prices, callback) => {
        // WRITE THE MAGIC LOGIC HERE
        const results = calculateNutritionAmount({ name, days, pregnantCount, sixtothreeCount, threetosixCount }, true, prices);
        await jsonServer.put(`/reports/${id}`, { name, days, pregnantCount, sixtothreeCount, threetosixCount, results });
        dispatch({
            type: 'edit_report',
            payload: { id, name, days, pregnantCount, sixtothreeCount, threetosixCount, results }
        });
        callback();
    }
}

export const { Context, Provider } = createDataContext(
    reportReducer,
    { addReport, deleteReport, editReport, getReports },
    []
)