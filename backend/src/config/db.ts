import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(`${process.env.DB}`, {
      dbName: process.env.DB_NAME,
    });
    console.log(`✅ DB connected`);
  } catch (error) {
    console.error(`DB connect Error : ${error}`);
    process.exit(1);
  }
};
