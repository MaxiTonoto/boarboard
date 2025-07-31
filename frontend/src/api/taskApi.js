import { API_URL } from './setUpApi.js';
import axios from 'axios';


const TASK_URL = API_URL + "/tasks/";


export const postTask = (task) => {
    
  return axios.post(TASK_URL, task);
};

export const patchTaskOrder = async (taskId, newOrder) => {
    
  return axios.patch(
    TASK_URL + taskId + "/",
    {order: newOrder,}
  );
};

export const patchTaskColumn = (taskId, newColumn) => {
    
  return axios.patch(
    TASK_URL + taskId + "/",
    {column: newColumn,}
  );
};

export const patchTaskColumnAndOrder = (taskId, newColumn, newOrder) => {
    
  return axios.patch(
    TASK_URL + taskId + "/",
    {
      column: newColumn,
      order: newOrder,
    }
  );
};

export const deleteTask = (taskId) => {
    
  return axios.delete(TASK_URL + taskId + "/");
};