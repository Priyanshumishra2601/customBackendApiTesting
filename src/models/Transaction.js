import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Transaction schema capturing financial inflow and outflow.
 */
const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      // Joi + controller also enforce this, but schema validation prevents bypasses.
      validate: {
        validator: (value) => value >= 0,
        message: "Amount must be non-negative"
      }
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      minlength: 1
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: undefined
    }
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);

