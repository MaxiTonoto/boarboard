import { API_URL } from "./setUpApi.js";
import axios from "axios";

const COLUMN_URL = API_URL + "/columns/";

export const postColumn = async (column) => {

  return axios.post(COLUMN_URL, column);
};