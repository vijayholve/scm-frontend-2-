// Single API entry point
// - Exposes configured axios client
// - Exposes endpoints registry
// - Exposes userDetails helper

import apiClient, {
  userDetails,
  getDocumentsByAccountAndUser,
  downloadUserDocument,
  getUserSchoolClassDivision
} from '../utils/apiService';
import endpoints from './endpoints';

export { endpoints, userDetails, getDocumentsByAccountAndUser, downloadUserDocument, getUserSchoolClassDivision };
export default apiClient;
