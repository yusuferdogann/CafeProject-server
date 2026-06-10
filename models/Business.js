import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    plan: { type: String, default: "trial" },
    status: { type: String, enum: ["active", "past_due", "cancelled"], default: "active" },
    platform: { type: String, default: "trial" },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    trialEndsAt: { type: Date },
    lastPaymentAt: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    externalId: { type: String },
  },
  { _id: false }
);

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscription: subscriptionSchema,
    settings: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Business || mongoose.model("Business", businessSchema);
