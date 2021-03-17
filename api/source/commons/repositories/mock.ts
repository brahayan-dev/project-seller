import _ from "lodash";
import dayjs from "dayjs";
import faker from "faker";
import store from "store2";
import { orderCode } from "@/helpers/toolkit";

type ShippingMethod = {
  name: string;
  id: string;
};

type NewOrder = {
  sellerStore: string;
  shippingMethodId: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerFullName: string;
  shippingAddress: string;
  shippingCountry: string;
  shippingRegion: string;
  shippingCity: string;
  externalOrderNumber: string;
  products: object[];
};

faker.locale = "es";

const amountOfRecords = 11;
const $orders = store.namespace("orders");
const $shipments = store.namespace("shipments");

const generateIdEnhanced = (id: number) => {
  return `${id}-${Date.now()}-${_.random(0, $orders.size())}`;
};

export const orders = {
  load(): void {
    _.range(1, amountOfRecords).forEach((id) => {
      const idEnhanced = generateIdEnhanced(id);

      $orders.set(idEnhanced, {
        id: idEnhanced,
        createdAt: dayjs(faker.date.recent(7)).format("YYYY-MM-DD"),
        sellerStore: faker.company.companyName(),
        sellOrderNumber: orderCode(),
        shippingMethodId: null,
        shippingMethod: null,
      });
    });
  },
  list(): object[] {
    return Object.values($orders.getAll());
  },
  show(id: string): object {
    return $orders.get(id);
  },
  seed(shippingMethods: ShippingMethod[]): void {
    Object.values($orders.getAll()).forEach((order) => {
      const { name, id } = faker.random.arrayElement(shippingMethods);

      shippingMethods.forEach((shipping) => {
        $shipments.set(shipping.id, shipping.name);
      });

      $orders.set(order.id, {
        ...order,
        shippingMethod: name,
        shippingMethodId: id,
      });
    });
  },
  write(newSellOrder: NewOrder) {
    const id = generateIdEnhanced($orders.size() + 2);
    const order = {
      ...newSellOrder,
      sellOrderNumber: orderCode(),
      createdAt: dayjs().format("YYYY-MM-DD"),
      shippingMethod: $shipments.get(newSellOrder.shippingMethodId),
      id,
    };

    $orders.set(id, order);

    return order;
  },
};
