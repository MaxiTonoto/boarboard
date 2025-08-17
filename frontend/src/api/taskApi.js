import { API_URL } from './setUpApi.js';
import axios from 'axios';


const TASK_URL = API_URL + "/tasks/";


export const postTask = async (task, accessToken) => {
    
  return axios.post(
    TASK_URL,
    task,
    {headers: {
      Authorization: `Bearer ${accessToken}`,
    }}
  );
};

export const patchTaskOrder = async (taskId, newOrder) => {
    
  return axios.patch(
    TASK_URL + taskId + "/",
    {order: newOrder,}
  );
};

export const patchTaskColumn = async (taskId, newColumn) => {
    
  return axios.patch(
    TASK_URL + taskId + "/",
    {column: newColumn,}
  );
};

export const patchTaskColumnAndOrder = async (taskId, newColumn, newOrder) => {
    
  return axios.patch(
    TASK_URL + taskId + "/",
    {
      column: newColumn,
      order: newOrder,
    }
  );
};

export const patchTaskContent = async (taskId, newTitle, newDescription, accessToken) => {
    
  return axios.patch(
    TASK_URL + taskId + "/",
    {
      title: newTitle,
      description: newDescription,
    },
    {headers: {
      Authorization: `Bearer ${accessToken}`,
    }}
  );
};

export const deleteTask = async (taskId, accessToken) => {
    
  return axios.delete(
    TASK_URL + taskId + "/",
    {headers: {
      Authorization: `Bearer ${accessToken}`,
    }}
  );
};