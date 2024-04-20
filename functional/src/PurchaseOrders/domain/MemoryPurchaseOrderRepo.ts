import { okAsync as OkAsync } from "neverthrow";
import * as R from "remeda";

import { Option } from "../../utilities/option";
import { PurchaseOrder } from "./PurchaseOrder";
import { PurchaseOrderRepo } from "./PurchaseOrderRepo";

export const MemoryPurchaseOrderRepo = {
  new: (): PurchaseOrderRepo => {
    const purchaseOrders: PurchaseOrder[] = [];
    return {
      save: (po) => {
        purchaseOrders.push(po);
        return OkAsync(null);
      },
      fetch: (id) =>
        R.pipe(
          purchaseOrders,
          R.find(R.hasSubObject({ id })),
          Option.nonNull,
          OkAsync
        ),
    };
  },
};
