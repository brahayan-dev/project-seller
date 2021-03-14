import _ from "lodash";
import faker from "faker";
import store from "store2";

faker.locale = "es_MX";

const amountOfRecords = 11;
const $orders = store.namespace("orders");

type ShippingMethod = {
  name: string;
};

export const orders = {
  load(): void {
    _.range(1, amountOfRecords).forEach((id) => {
      $orders.set(id, {
        id,
        createdAt: faker.date.recent(2),
        sellerStore: faker.company.companyName(),
        sellOrderNumber: faker.random.uuid(),
        shippingMethod: null,
      });
    });
  },
  list(): object[] {
    return Object.values($orders.getAll());
  },
  show(id: number): object {
    return $orders.get(id);
  },
  seed(shippingMethods: ShippingMethod[]): void {
    Object.values($orders.getAll()).forEach((order) => {
      const { name } = faker.random.arrayElement(shippingMethods);

      $orders.set(order.id, {
        ...order,
        shippingMethod: name,
      });
    });
  },
  write() {
    const id = $orders.size() + 1;

    return $orders.get(id, {
        // TODO: add type and implementation
    });
  },
};
