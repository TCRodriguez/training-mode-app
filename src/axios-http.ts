import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.trainingmode.gg/v1'
});