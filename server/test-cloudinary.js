import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// This bypasses file uploading and just tests if your API keys are accepted
cloudinary.api.ping()
    .then(result => console.log("Authentication Successful! Connection works:", result))
    .catch(error => {
        console.log("--- CLOUDINARY ERROR DETAILS ---");
        console.error(error);
    });