import mongoose, { Document, Schema } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    instagram: String,
    facebook: String,
    linkedin: String,
    bio: String,
}, {
    timestamps: true,
});
export const User = mongoose.model("BlogUser", userSchema);
//# sourceMappingURL=User.js.map