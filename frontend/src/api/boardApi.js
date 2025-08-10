import { API_URL } from './setUpApi.js';
import axios from 'axios';

const BOARD_URL = API_URL + "/boards/";
const USER_BOARDS_URL = BOARD_URL + "user-boards/";

export const getBoards = () => {
    
    return axios.get(BOARD_URL + "boards/");
};

export const getUserBoards = async (accessToken) => {
    
    const response = await axios.get(USER_BOARDS_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });

    return response;
};

export const postBoard = async (accessToken, board) => {
    try {
        const response = await axios.post(
            BOARD_URL + "boards/",
            board,
            {headers: {
              Authorization: `Bearer ${accessToken}`,
            }}
        );
        return response;
    } catch (error) {
        console.log(error);
    }

};

export const getBoard = (boardId, accessToken) => {

    return axios.get(
      (BOARD_URL + "boards/" + boardId + "/"),
      {headers: {
        Authorization: `Bearer ${accessToken}`,
      }}
    );
};

export const deleteBoard = (boardId, accessToken) => {

    return axios.delete(
      (BOARD_URL + "boards/" + boardId + "/"),
      {headers: {
        Authorization: `Bearer ${accessToken}`,
      }}
    );
};