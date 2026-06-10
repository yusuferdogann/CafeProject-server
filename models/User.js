import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "garson"], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ businessId: 1, email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
