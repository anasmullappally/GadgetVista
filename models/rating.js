import mongoose from "mongoose";


const ratingSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Products",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        trim: true,
        required: true
    },
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    notHelpful: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
}, { collection: "Ratings", timestamps: true }
);

export const Ratings = mongoose.model("Ratings", ratingSchema);