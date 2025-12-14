import { SERVER_URL_WITH_PREFIX } from "@/constants";
import axios, { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: `${SERVER_URL_WITH_PREFIX}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const request = async (config: AxiosRequestConfig) => {
  try {
    if (!config.headers) {
      config.headers = {};
    }
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    const response = await axiosInstance.request({ ...config });
    return {
      remote: "success",
      data: response.data,
    };
  } catch (error: any) {
    if (error) {
      const axiosError = error;
      if (axiosError.response && axiosError.response.data) {
        let errorMessage = axiosError.response.data;
        if (axiosError.response.status === 500) {
          errorMessage = {
            message: ["Internal Server Error"],
          };
        }
        for (const key in errorMessage) {
          errorMessage[key] = errorMessage[key][0];
        }
        return {
          remote: "failure",
          error: {
            status: axiosError.response.status,
            errors: errorMessage,
          },
        };
      }
    } else {
      const axiosError = error;
      const errorMessage = axiosError.message;
      return {
        remote: "failure",
        error: {
          errors: errorMessage,
        },
      };
    }
  }
  throw Error;
};

export default { axiosInstance, request };
