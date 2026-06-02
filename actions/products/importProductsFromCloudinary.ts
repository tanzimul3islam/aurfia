'use server';

import { v2 as cloudinary } from "cloudinary";
import { isUserAdmin } from "../auth/isUserAdmin";
import { isSuperAdminSession } from "../auth/isSuperAdminSession";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinaryGallery() {
  const isAdmin = await isUserAdmin();
  const isSuperAdmin = await isSuperAdminSession();

  if(!isAdmin && !isSuperAdmin) {
    throw new Error('Unauthorized');
  }
  try {
    // Fetch resources from the 'products' folder
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "products",
      max_results: 500, // adjust as needed
    });
    const transformedResults = result.resources.map((res: any) => ({
      url: res.secure_url,
      public_id: res.public_id,
    }));
    console.log(transformedResults,'ranned like a champ')
    // Return array of URLs
    return transformedResults;
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    return [];
  }
}
