import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectDB = async() =>{
    mongoose.connection.on('connected',()=> console.log('Database connected'));
    await mongoose.connect(`${process.env.MONGODB_URI}/hirehub`)
}
export default connectDB;