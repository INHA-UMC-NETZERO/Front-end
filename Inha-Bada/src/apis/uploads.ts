import type { UploadsPresignedURLRequest, UploadsPresignedURLResponse } from "../types/uploads";
import axiosInstance from "./axios";

export const postPresignedUrl = async (data : UploadsPresignedURLRequest) : Promise<UploadsPresignedURLResponse> => {
    const response = await axiosInstance.post(`/api/uploads/presigned-url`, data)

    return response.data;
}