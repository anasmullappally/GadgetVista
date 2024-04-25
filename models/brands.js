import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        activeProducts: {
            type: Number,
            default: 0
        },
        totalProducts: {
            type: Number,
            default: 0
        }
    },
    { collection: "Brands", timestamps: true }
);

export const Brands = mongoose.model("Brands", brandSchema);