import axios from 'axios';

const baseUrl = "http://localhost:3001";

export const Axios = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'schema',
        'Access-Control-Allow-Origin': "http://127.0.0.1:3001",
        'Access-Control-Allow-Methods': "HEAD, GET, POST, PUT, DELETE",
    }
});
export const Canceler = axios.CancelToken.source();