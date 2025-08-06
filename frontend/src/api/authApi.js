import axios from 'axios';
import { API_URL } from './setUpApi.js';


const AUTH_URL = API_URL + "/auth/";

export const postUser = async (data) => {
  
  return axios.post(
      AUTH_URL + "register/",
      data,
      { 
          headers: {'Content-Type' : 'application/json'},
          withCredentials: true, 
      }
  );
};

export const loginUser = async (data) => {
  
  const response = await axios.post(
      AUTH_URL + "login/",
      data,
      { 
          headers: {'Content-Type' : 'application/json'},
          withCredentials: true, 
      }
  );

  return response;
};


export const logoutUser = async (data) => {
  
  return axios.post(
      AUTH_URL + "logout/",
      data,
      { 
          headers: {'Content-Type' : 'application/json'},
          withCredentials: true, 
      }
  );
};



export const refreshUser = async () => {

  const response = await axios.post(
    AUTH_URL + "refresh/",
    {},
    { 
      headers: {'Content-Type' : 'application/json'},
      withCredentials: true, 
    }
  );
  return response;
};