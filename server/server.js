
import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import {v2 as cloudinary} from 'cloudinary'
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import {clerkMiddleware} from '@clerk/express';

const app = express();

//connecting db
await connectDB();
await connectCloudinary();
// try {
//   const result = await cloudinary.uploader.upload(
//     "https://res.cloudinary.com/demo/image/upload/sample.jpg"
//   );

//   console.log(result);
// } catch (err) {
//   console.dir(err, { depth: null });
// }


app.use(cors());

app.use(express.json());
app.post('/webhooks',clerkWebhooks);
app.use(clerkMiddleware()); //help decode token and get user info from it.

app.get('/', (req, res) => {
    res.send('API working');
});

app.get("/debug-sentry", function mainHandler(req,res) {
    throw new Error("My first Sentry error!");
});


app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users',userRoutes);

const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});