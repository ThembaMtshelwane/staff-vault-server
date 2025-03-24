import User from "../model/userModel";

import {
  deleteOneDoc,
  fetchDocs,
  fetchDocsByPagination,
  fetchOneDoc,
} from "../service/crudHandlerFactory";

export const fetchAllUsers = fetchDocs(User);
export const fetchFilteredUsers = fetchDocsByPagination(User);
export const fetchUserById = fetchOneDoc(User);
export const deleteUser = deleteOneDoc(User);
