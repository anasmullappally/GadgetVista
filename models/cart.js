import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brands",
            required: true
        },
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Variants",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Users",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
    }, { collection: "Carts", timestamps: true }
);

export const Cart = mongoose.model("Carts", cartSchema);