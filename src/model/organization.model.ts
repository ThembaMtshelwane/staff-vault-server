import { model, Model, Schema } from "mongoose";
import { IOrganizationDocument } from "../detinitions";

const organizationSchema: Schema<IOrganizationDocument> =
  new Schema<IOrganizationDocument>(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      registrationNumber: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Organization: Model<IOrganizationDocument> = model<IOrganizationDocument>(
  "Organization",
  organizationSchema
);

export default Organization;
