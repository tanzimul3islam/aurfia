import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload local File or Buffer
export async function uploadImageBuffer(buffer: Buffer, fileName: string) {
  return new Promise<string>((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream(
      {
        //change the folder as per clients requirements
        folder: "products",
        resource_type: "image",
        quality: "auto:best",
        fetch_format: "auto",
        public_id: fileName.split(".")[0],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );

    upload_stream.end(buffer);
  });
}
