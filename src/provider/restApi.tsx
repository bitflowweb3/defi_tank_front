import React from 'react';
import axios from "axios";

import { config } from '../config/config';

axios.defaults.baseURL = config.BACKEND_URL;

export const restApi = {

}