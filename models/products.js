import mongoose from "mongoose";

// const variantSchema = new mongoose.Schema(
//     {
//         ram: {
//             type: Number,
//             required: true,
//             min: 1
//         },
//         rom: {
//             type: Number,
//             required: true,
//             min: 1
//         },
//         mrp: {
//             type: Number,
//             required: true,
//             min: 1
//         },
//         price: {
//             type: Number,
//             required: true,
//             min: 1
//         },
//         shippingCharge: {
//             type: Number,
//             required: true,
//             min: 1
//         },
//         quantity: {
//             type: Number,
//             required: true,
//             min: 1
//         },
//         colors: [
//             {
//                 color: {
//                     type: String,
//                     trim: true,
//                     required: true
//                 },
//                 colorCode: {
//                     type: String,
//                     trim: true,
//                     required: true
//                 }
//             }
//         ]
//     }
// )

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
        // images:{}
        // description: {
        //     type: String,
        //     required: true,
        //     trim: true
        // },
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
        // variants: [variantSchema],
        // quantityInfo: {
        //     total: {
        //         type: Number,
        //         required: true,
        //         min: 1
        //     },
        //     sold: {
        //         type: Number,
        //         default: 0
        //     }
        // },
        isVisible: {
            type: Boolean,
            default: false
        },
    },
    { collection: "Products", timestamps: true }
);

export const Products = mongoose.model("Products", productSchema);