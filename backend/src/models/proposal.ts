import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProposalPricing {
  item: string;
  price: number;
  quantity: number;
}

export interface IProposal extends Document {
  rfp: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  pricing: IProposalPricing[];
  terms?: string;
  conditions?: string;
  deliveryEstimate?: string;
  score: number;
  reasoning?: string;
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema: Schema<IProposal> = new Schema(
  {
    rfp: {
      type: Schema.Types.ObjectId,
      ref: "rfp",
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    pricing: [
      {
        item: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    terms: {
      type: String,
    },
    conditions: {
      type: String,
    },
    deliveryEstimate: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
    },
    reasoning: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Proposal: Model<IProposal> =
  mongoose.models.Proposal ||
  mongoose.model<IProposal>("Proposal", proposalSchema);

export default Proposal;
