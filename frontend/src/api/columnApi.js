import { API_URL } from "./setUpApi.js";
import axios from "axios";

const COLUMN_URL = API_URL + "/columns/";

export const postColumn = async (column, accessToken) => {

  return axios.post(
    COLUMN_URL,
    column,
    {headers: {
      Authorization: `Bearer ${accessToken}`,
    }}
  );
};

export const deleteColumn = async (columnId, accessToken) => {

  return axios.delete(
    (COLUMN_URL + columnId + "/"),
    {headers: {
      Authorization: `Bearer ${accessToken}`,
    }}
  );
};