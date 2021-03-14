import { orders } from "@/repositories/mock";
import { getShippingMethods } from "@/repositories/api";

export const every = async (req: any, res: any) => {
  const { data } = await getShippingMethods();
  orders.seed(data);

  return res.json({ data: orders.list() });
};

export const detail = (req: any, res: any) => {
  return res.json({ message: "Hello from create/app!" });
};
