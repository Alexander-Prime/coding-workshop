import { errAsync as ErrAsync, okAsync as OkAsync } from "neverthrow";
import * as R from "remeda";

import { Option } from "../../utilities/option";
import { PurchaseOrder } from "./PurchaseOrder";
import { PurchaseOrderNumber } from "./PurchaseOrderNumber";
import { PurchaseOrderRepo } from "./PurchaseOrderRepo";

export const MemoryPurchaseOrderRepo = {
  new: (): PurchaseOrderRepo => {
    const purchaseOrders: PurchaseOrder[] = [];
    const counters: Record<string, number> = {};

    return {
      nextPoNumber: (prefix) => {
        // Ensure the prefix can generate a legal PO number before incrementing
        if (!PurchaseOrderNumber.check(`${prefix}-000001`)) {
          return ErrAsync(
            new Error(`"${prefix}" is not a valid purchase order prefix`)
          );
        }

        counters[prefix] = (counters[prefix] ?? 0) + 1;

        return OkAsync(
          `${prefix}-${counters[prefix]
            .toFixed()
            .padStart(6, "0")}` as PurchaseOrderNumber
        );
      },

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
