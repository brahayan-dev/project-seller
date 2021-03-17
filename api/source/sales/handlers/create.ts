import { orders } from "@/repositories/mock";
import { body, validationResult } from "express-validator";

const config = { checkFalsy: true };
export const entityValidation = [
  body("buyerEmail", "El correo del comprador no es válido").isEmail(),
  body("buyerPhone", "Se requiere el teléfono del comprador").exists(config).isNumeric(),
  body("buyerFullName", "Es requerido el nombre completo del comprador").exists(config),
  body("sellerStore", "Es requerido el nombre de la tienda del vendedor").exists(config),
  body("externalOrderNumber", "Se requiere el número de oredn externo").exists(config).isNumeric(),
  body("shippingMethodId", "Debe seleccionar un método de envío").exists(config).isNumeric(),
  body("shippingAddress", "Se requiere una dirección de envío").exists(config),
  body("shippingCountry", "Se requiere un país de envío").exists(config),
  body("shippingRegion", "Se requiere una región de envío").exists(config),
  body("shippingCity", "Se requiere una ciudad de envío").exists(config),
  body("products").isArray(),
];

export const entity = async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = orders.write(req.body);

  return res.json({ data });
};
