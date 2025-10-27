import { v2 as cloudinary } from "cloudinary";
import { CloudinarySignatureResponseDto } from "../types/dtos/cloudinary/cloudinary.dto";
import { ICloudinaryService } from "../types/service-interface/ICloudinaryService";
import { config } from "../config";
import { injectable } from "tsyringe";

@injectable()
export class CloudinaryService implements ICloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: config.cloudinary.CLOUDINARY_CLOUD_NAME,
      api_key: config.cloudinary.CLOUDINARY_API_KEY,
      api_secret: config.cloudinary.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  getUploadSignature(): CloudinarySignatureResponseDto {
    const timeStamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp:timeStamp, folder: "avatars" },
      config.cloudinary.CLOUDINARY_API_SECRET
    );

    return {
      timeStamp,
      apiKey: config.cloudinary.CLOUDINARY_API_KEY,
      cloudName: config.cloudinary.CLOUDINARY_CLOUD_NAME,
      signature,
    };
  }
}
