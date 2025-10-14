import { model, Schema } from "mongoose";
import { ISprint } from "../types/entities/ISprint";

const sprintSchema = new Schema<ISprint>(
  {
    sprintId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    normalizedName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    endDate: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const sprintModel = model("sprint", sprintSchema);
