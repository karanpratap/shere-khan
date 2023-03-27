import createDataContext from "./createDataContext";
import releaseInfo from "../api/releaseInfo";
import { expo } from "../../app.json";
import RNFetchBlob from "rn-fetch-blob";
const { config, fs } = RNFetchBlob;

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

const downloadUpdate = (apk) => {
    const downloadDir = fs.dirs.DownloadDir;
    const options = {
        fileCache: true,
        addAndroidDownloads: {
            useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
            notification : true,
            path:  downloadDir + "/" + apk, // this is the path where your downloaded file will live in
            description : 'Downloading Update.'
        }
    }
    try {
        config(options).fetch('GET', `http://144.24.138.90/release/${apk}`).then((res) => {
            console.log('UPDATE DOWNLOADED', res);
            // do some magic here
        })
    }
    catch (err) {
        console.log('Error Downloading update -> ', err);
    }
}

export const { Context, Provider } = createDataContext(
    releaseReducer,
    { getReleaseInfo, downloadUpdate },
    []
)