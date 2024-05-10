import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["phone", "laptop"]
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Brands",
            required: true
        },
        shippingCharge: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        releaseDate: {
            type: Date,
            required: true
        },
        accessories: {
            type: String,
            required: true,
            trim: true
        },
        warrantyInfo: {
            type: String,
            required: true,
            trim: true
        },
        variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variants" }],
        isVisible: {
            type: Boolean,
            default: false
        },
        ratings: {
            overallRating: {
                type: Number,
                default: 0
            },
            numberOfRatings: {
                type: Number,
                default: 0
            },
            numberOfReview: {
                type: Number,
                default: 0
            },

        }
    },
    { collection: "Products", timestamps: true }
);

export const Products = mongoose.model("Products", productSchema);