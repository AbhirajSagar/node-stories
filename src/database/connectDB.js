import mongoose from "mongoose";

export default async function connectDB()
{
    if (mongoose.connection.readyState >= 1) return; // Return if already connected
    const dbInstance = await mongoose.connect(process.env.MONGO_URI,
    {
        dbName: 'public'
    });
    return dbInstance;
}

