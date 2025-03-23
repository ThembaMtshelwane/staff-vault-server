import User from "../model/userModel";

import { fetchDocs } from "../service/crudHandlerFactory";

const fetchAllUsers = fetchDocs(User);

export { fetchAllUsers };
