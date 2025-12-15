import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVendor extends Document {
  name: string;
  email: string;
  contactInfo?: string;
  rfpAssignments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema: Schema<IVendor> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contactInfo: {
      type: String,
    },
    rfpAssignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "RFP",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Vendor: Model<IVendor> = mongoose.model<IVendor>("Vendor", vendorSchema);

export default Vendor;
