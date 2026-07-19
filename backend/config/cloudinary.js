const cloudinary = require("cloudinary").v2;
const env = require("./env");

console.log('Cloudinary config check:', {
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  has_secret: !!env.CLOUDINARY_API_SECRET,
  secret_length: env.CLOUDINARY_API_SECRET?.length,
});

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;