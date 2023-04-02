import createDataContext from "./createDataContext";
import jsonServer from "../api/jsonServer";
import calculateNutritionAmount from "../api/calculator";

const reportCenterReducer = (state, action) => {
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

const getCenterReports = dispatch => {
    return async () => {
        const response = await jsonServer.get('/reports_center');
        dispatch({ type: 'get_reports', payload: response.data });
        console.log(response.data);
        // let centers = {};
        // const response = await jsonServer.get('/reports_cemter');
        // response.data.forEach(report => {
        //     centers[report.belongsTo] ? centers[report.belongsTo].push(report.name) : centers[report.belongsTo] = [report.name];
        // });
        // dispatch(centers);
        // }
    }
};

const addCenterReport = () => {
    return async (name, days, pregnantCount, sixtothreeCount, threetosixCount, belongsTo, callback) => {
        // const results = calculateNutritionAmount({ name, days, pregnantCount, sixtothreeCount, threetosixCount, money }, true, prices);
        await jsonServer.post('/reports_center', {name, days, pregnantCount, sixtothreeCount, threetosixCount, belongsTo });
        // dispatch({type: 'add_blogpost', payload: {title, content}});
        callback();
    };
};

const deleteCenterReport = dispatch => {
    return async (id) => {
        await jsonServer.delete(`/reports_center/${id}`);
        dispatch({type: 'delete_report', payload: id});
    }
}

const editCenterReport = dispatch => {
    return async (name, days, pregnantCount, sixtothreeCount, threetosixCount, belongsTo, id, callback) => {
        // const results = calculateNutritionAmount({ name, days, pregnantCount, sixtothreeCount, threetosixCount }, true, prices);
        await jsonServer.put(`/reports_center/${id}`, { name, days, pregnantCount, sixtothreeCount, threetosixCount, belongsTo });
        dispatch({
            type: 'edit_report',
            payload: { id, name, days, pregnantCount, sixtothreeCount, threetosixCount, belongsTo }
        });
        callback();
    }
}

export const { Context, Provider } = createDataContext(
    reportCenterReducer,
    { addCenterReport, deleteCenterReport, editCenterReport, getCenterReports },
    []
)