import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.trainingmode.app/v1'
});