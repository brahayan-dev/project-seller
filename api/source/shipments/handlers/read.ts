import { getShippingMethods } from "@/repositories/api";

export const every = async (req: any, res: any) => {
  const shippingMethods = await getShippingMethods();

  return res.json(shippingMethods);
};
