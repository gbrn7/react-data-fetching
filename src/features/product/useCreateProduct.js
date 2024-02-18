import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useCreateProduct = ({
  onSuccess }) => {
  return useMutation({
    mutationFn: async (body) => {
      const productsRes = await axiosInstance.post("/products", body);

      return productsRes;
    },
    onSuccess
  });

}