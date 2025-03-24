import User from "../model/userModel";

import {
  fetchDocs,
  fetchDocsByPagination,
  fetchOneDoc,
} from "../service/crudHandlerFactory";

export const fetchAllUsers = fetchDocs(User);
export const fetchFilteredUsers = fetchDocsByPagination(User);
export const fetchUserById = fetchOneDoc(User);
