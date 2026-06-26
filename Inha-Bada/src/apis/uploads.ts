import type { UploadResponse } from "../types/uploads";
import axiosInstance from "./axios";

export const postUploadFiles = async (files: File[]): Promise<UploadResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });

    const response = await axiosInstance.post(`/api/uploads`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};
