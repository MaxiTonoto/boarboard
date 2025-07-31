import { API_URL } from './setUpApi.js';
import axios from 'axios';


const TASK_URL = API_URL + "/tasks/";


export const postTask = (task) => {
    
  return axios.post(TASK_URL, task);
};

export const patchTaskOrder = async (taskId, newOrder) => {
  
  const response = await axios.patch(TASK_URL + taskId + "/",
    {order: newOrder,}
  );

  return response;
};

export const patchTaskColumn = async (taskId, newColumn) => {
  
  const response = await axios.patch(TASK_URL + taskId + "/",
    {column: newColumn,}
  );

  return response;
};

export const patchTaskColumnAndOrder = async (taskId, newColumn, newOrder) => {
  
  const response = await axios.patch(TASK_URL + taskId + "/",
    {
      column: newColumn,
      order: newOrder,
    }
  );

  return response;
};

export const deleteTask = async (taskId) => {
  
  const response = await axios.delete(TASK_URL + taskId + "/");

  return response;
};