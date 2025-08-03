import { API_URL } from './setUpApi.js';
import axios from 'axios';


const BOARD_URL = API_URL + "/boards/";


export const getBoards = () => {
    
    return axios.get(BOARD_URL);
};

export const postBoard = (board) => {

    return axios.post(BOARD_URL, board);
}

export const getBoard = (boardId) => {

    return axios.get(BOARD_URL + boardId + "/");
}