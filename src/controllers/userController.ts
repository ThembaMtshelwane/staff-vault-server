import User from "../model/userModel";

import {
  fetchDocs,
  fetchDocsByPagination,
} from "../service/crudHandlerFactory";

const fetchAllUsers = fetchDocs(User);
const fetchFilteredUsers = fetchDocsByPagination(User);

export { fetchAllUsers, fetchFilteredUsers };
