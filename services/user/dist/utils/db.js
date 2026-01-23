import mongoose from "mongoose";
export default async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to db successfully");
    }
    catch (error) {
        console.log(error);
    }
}
//# sourceMappingURL=db.js.map