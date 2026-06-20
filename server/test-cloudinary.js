import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

try {
  const usage = await cloudinary.api.usage();
  console.log("USAGE SUCCESS");
  console.log(usage);
} catch (err) {
  console.dir(err, { depth: null });
}