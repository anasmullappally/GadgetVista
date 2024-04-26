import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        // images:{}
        description: {
            type: String,
            required: true,
            trim: true
        },
        ram: {
            type: Number,
            required: true,
            min: 1
        },
        rom: {
            type: Number,
            required: true,
            min: 1
        },
        mrp: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 1
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        color: {
            type: String,
            trim: true,
            required: true
        },
        colorCode: {
            type: String,
            trim: true,
            required: true
        }
    }, { collection: "Variants", timestamps: true }
);

export const Variants = mongoose.model("Variants", variantSchema);