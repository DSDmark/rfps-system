import mongoose, { Document, Schema } from "mongoose";

interface RFPItem {
  name: string;
  quantity: number;
  specs: string;
}

export interface RFPDocument extends Document {
  title: string;
  description: string;
  items: RFPItem[];
  budget: number;
  deliveryTimeline: string;
  paymentTerms: string;
  warranty: string;
  status: string;
  vendorIds: string[];
  proposals: mongoose.Schema.Types.ObjectId[];
}

const RFPItemSchema = new Schema<RFPItem>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    specs: { type: String },
  },
  { _id: false },
);

const RFPSchema = new Schema<RFPDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    items: { type: [RFPItemSchema], default: [] },
    budget: { type: Number },
    deliveryTimeline: { type: String },
    paymentTerms: { type: String },
    warranty: { type: String },
    status: { type: String, default: "draft" },
    vendorIds: { type: [String], default: [] },
    proposals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Proposal",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<RFPDocument>("rfp", RFPSchema);
