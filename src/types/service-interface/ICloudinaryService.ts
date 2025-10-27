import { CloudinarySignatureResponseDto } from "../dtos/cloudinary/cloudinary.dto";

export interface ICloudinaryService {
  getUploadSignature(): CloudinarySignatureResponseDto;
}
