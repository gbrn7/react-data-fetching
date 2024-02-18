import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
//hook is just a function
export const useFetchProducts = ({ onError }) => {
  return useQuery({
    queryFn: async () => {
      const productRes = await axiosInstance.get("/products");

      return productRes;
    },
    queryKey: ["fetch.products"]
  })
}