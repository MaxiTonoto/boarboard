import { API_URL } from './setUpApi.js';
import axios from 'axios';


const TASK_URL = API_URL + "/tasks/";


export const postTask = (task) => {
    
    return axios.post(TASK_URL, task);
};

export const deleteTask = (taskId) => {
    
    return axios.delete(TASK_URL + taskId);
};