import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.trainingmode.gg/v1'
    // baseURL: 'http://127.0.0.1:8000/v1'
});