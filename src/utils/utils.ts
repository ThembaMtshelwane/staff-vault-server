import { IDepartmentBasicInfo } from "../detinitions";

export const removeDuplicates = (
  input: string[] | IDepartmentBasicInfo[]
): {
  uniqueStrings?: string[];
  uniqueObjects?: IDepartmentBasicInfo[];
  duplicates: number;
} => {
  let duplicates = 0;

  if (typeof input[0] === "string") {
    const uniqueStrings = Array.from(new Set(input as string[]));
    duplicates = input.length - uniqueStrings.length;

    return { uniqueStrings, duplicates };
  } else if (typeof input[0] === "object" && "name" in input[0]) {
    const seenNames = new Set<string>();

    const uniqueObjects = (input as IDepartmentBasicInfo[]).filter((obj) => {
      if (seenNames.has(obj.name)) return false;
      seenNames.add(obj.name);
      return true;
    });

    duplicates = input.length - uniqueObjects.length;

    return { uniqueObjects, duplicates };
  } else {
    throw new Error(
      "Invalid input type. Must be an array of strings or an array of objects with a 'name' property."
    );
  }
};
