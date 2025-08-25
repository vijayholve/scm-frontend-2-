// Single API entry point
// - Exposes configured axios client
// - Exposes endpoints registry
// - Exposes userDetails helper

import apiClient, { userDetails } from '../utils/apiService';
import endpoints from './endpoints';

export { endpoints, userDetails };
export default apiClient;


