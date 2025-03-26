import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "../constants/http.codes";
import { IDepartment, IDepartmentBasicInfo } from "../detinitions";
import Department from "../model/departmentModel";
import HTTP_Error from "../utils/httpError";
import { removeDuplicates } from "../utils/utils";

export const massDepartmentCreationService = async (
  input: string[] | IDepartmentBasicInfo[]
) => {
  const { uniqueObjects: departmentsList, duplicates } =
    removeDuplicates(input);

  const errors: string[] = [];
  const data: IDepartment[] = [];
  let errorMessage = duplicates === 0 ? "" : `${duplicates} Duplicates removed`;

  if (departmentsList && departmentsList.length) {
    await Promise.all(
      departmentsList.map(async (departmentInfo) => {
        const { name, positions } = departmentInfo;
        let department = await Department.findOne({ name });
        if (!department) {
          department = await Department.create({
            name,
            positions,
          });
          data.push(department);
        } else {
          errors.push(`${name} already exists`);
        }
        return department;
      })
    );
  }

  if (errors.length === 0 && data.length === 0) {
    throw new HTTP_Error(
      `Failed to create all ${departmentsList?.length || 0} departments`,
      INTERNAL_SERVER_ERROR
    );
  }
  if (errors.length > 0 && data.length === 0) {
    throw new HTTP_Error(
      ` ${errors.length} departments already exist` + " and " + errorMessage,
      BAD_REQUEST
    );
  }
  errorMessage =
    errors.map((error) => `${error}\n`).join() + " and " + errorMessage;

  const message = `✔ Registered: ${data.length} department out of the${input.length} given.
      ⚠ Warning: ${errors.length} departments already exist.
      ℹ Details: ${errorMessage}`;

  return { data, message, errors };
};

export const addDepartmentService = async (
  departmentData: Partial<IDepartment>
) => {
  const { name, supervisor, positions } = departmentData;
  const departmentExists: IDepartment | null = await Department.findOne({
    name,
  });
  if (departmentExists) {
    throw new HTTP_Error("Department already exists", BAD_REQUEST);
  }

  const department: IDepartment = await Department.create({
    name,
    supervisor,
    positions,
  });

  return department;
};
