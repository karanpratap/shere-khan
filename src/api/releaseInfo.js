import axios from 'axios';
import expo from '../../app.json'

export default axios.create({
    baseURL: 'http://144.24.138.90'
});

// const getReleaseInfo = async () => {
//     const new_info = await releaseRoot.get('/release/releaseInfo.json');
//     return 'hello';
// }

// export default getReleaseInfo;