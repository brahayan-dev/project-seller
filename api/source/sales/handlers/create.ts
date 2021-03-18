import { orders } from "@/repositories/mock";
import {
  getOffDays,
  getShippingMethodDetail,
  MethodDetail,
} from "@/repositories/api";
import { body, validationResult } from "express-validator";
import dayjs from "dayjs";
import _ from "lodash";

const emptyPromiseAnswer = {
  packPromiseMin: null,
  packPromiseMax: null,
  deliveryPromiseMin: null,
  deliveryPromiseMax: null,
  readyPickupPromiseMin: null,
  readyPickupPromiseMax: null,
  shipPromiseMin: null,
  shipPromiseMax: null,
};

const isBusinessDay = (aDay: any, offDays: string[]) => {
  return _.isUndefined(
    offDays.find((date: string) => {
      return date === aDay.format("YYYY-MM-DD");
    })
  );
};

const generateNextBusinessDays = async (today: any, amountOfDays: number) => {
  const { data: offDays } = await getOffDays();

  let businessDays: string[] = [];
  let counter = 1;
  let amount = 0;

  do {
    let aDay = dayjs(today).add(counter, "day");

    if (isBusinessDay(aDay, offDays)) {
      businessDays = [...businessDays, aDay.format("YYYY-MM-DD")];
      amount++;
    }
    counter++;
  } while (amountOfDays > amount);

  return Promise.resolve(businessDays);
};

type Product = {
  name: string;
  quantity: number;
  weight: number;
};

type WeightInterval = {
  min: number;
  max: number;
};

const hasAvailableWeight = (
  products: Product[],
  interval: WeightInterval
): boolean => {
  const wholeWeight = products.reduce((acc, item) => {
    return acc + item.weight;
  }, 0);

  return _.inRange(interval.min, wholeWeight, interval.max);
};

type RequiredModel = {
  products: Product[];
  id: string;
  time: {
    dayType: string;
    fromTimeOfDay: number;
    toTimeOfDay: number;
  };
};

const calculatePromise = async (model: RequiredModel) => {
  try {
    const today = dayjs();

    const { data: offDays } = await getOffDays();
    const { data }: MethodDetail = await getShippingMethodDetail(model.id);
    const nextBusinessDays = await generateNextBusinessDays(today, 10);
    const canDeliveryByWeight = hasAvailableWeight(
      model.products,
      data.rules.availability.byWeight
    );

    if (!canDeliveryByWeight) {
      return Promise.resolve(emptyPromiseAnswer);
    }

    if (model.time.dayType === "BUSINESS") {
      if (!isBusinessDay(today, offDays)) {
        return Promise.resolve(emptyPromiseAnswer);
      }
    }

    if (model.time.dayType === "ANY") {
      if (!_.inRange(model.time.fromTimeOfDay, today.hour(), model.time.toTimeOfDay)) {
        return Promise.resolve(emptyPromiseAnswer);
      }
    }

    return Promise.resolve({ data, emptyPromiseAnswer, nextBusinessDays });
  } catch (error) {
    return Promise.reject({ error });
  }
};

export const entity = async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const promise = await calculatePromise({
    id: req.body.shippingMethodId,
    time: req.body.byRequestTime,
    products: req.body.products,
  });
  const data = orders.write(req.body);

  return res.json({ data, promise });
};

const config = { checkFalsy: true };
export const entityValidation = [
  body("buyerEmail", "El correo del comprador no es válido").isEmail(),
  body("buyerPhone", "Se requiere el teléfono del comprador")
    .exists(config)
    .isNumeric(),
  body("buyerFullName", "Es requerido el nombre completo del comprador").exists(
    config
  ),
  body(
    "sellerStore",
    "Es requerido el nombre de la tienda del vendedor"
  ).exists(config),
  body("externalOrderNumber", "Se requiere el número de oredn externo")
    .exists(config)
    .isNumeric(),
  body("shippingMethodId", "Debe seleccionar un método de envío")
    .exists(config)
    .isNumeric(),
  body("shippingAddress", "Se requiere una dirección de envío").exists(config),
  body("shippingCountry", "Se requiere un país de envío").exists(config),
  body("shippingRegion", "Se requiere una región de envío").exists(config),
  body("shippingCity", "Se requiere una ciudad de envío").exists(config),
  body("products").isArray(),
];
