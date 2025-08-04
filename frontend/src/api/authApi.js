import axios from 'axios';
import { API_URL } from './setUpApi.js';


const AUTH_URL = API_URL + "/auth/";

export const postUser = (data) => {

    return axios.post(AUTH_URL + "create/", data);
};