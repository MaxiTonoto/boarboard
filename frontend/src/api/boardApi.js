import { API_URL } from './setUpApi.js';
import axios from 'axios';


const BOARD_URL = API_URL + "/boards/";


export const getBoards = () => {
    
    return axios.get(BOARD_URL);
};


export const createBoard = (data) => {

    return axios.post(BOARD_URL, data);
}