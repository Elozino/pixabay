import axios, { AxiosError } from "axios";

const API_URL = `https://pixabay.com/api/?key=${process.env.EXPO_PUBLIC_API_KEY}`;

const formatURL = (params: Record<string, string | number | boolean>) => {
  let url = API_URL + "&per_page=25&safesearch=true&editors_choice=true";
  if (!params) return API_URL;
  let paramKeys = Object.keys(params);
  paramKeys.map((key: any) => {
    const value = key === "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  console.log("url: ", url);
  return url;
};

export const apiClient = async (
  params: Record<string, string | number | boolean>
) => {
  try {
    const response = await axios.get(formatURL(params));
    return response.data;
  } catch (error: any) {
    console.log("error: ", error);
    return { success: false, msg: error?.message };
  }
};
