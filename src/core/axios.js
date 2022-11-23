import axios from 'axios';

const baseUrl = "http://localhost:3001/api";

export const Axios = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin':true,
    }
});
export const Canceler = axios.CancelToken.source();