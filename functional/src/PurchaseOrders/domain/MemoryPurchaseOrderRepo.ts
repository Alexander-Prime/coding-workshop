import { errAsync as ErrAsync, okAsync as OkAsync } from "neverthrow";
import * as R from "remeda";

import { Option } from "../../utilities/option";
import { MemoryPurchaseOrderDb } from "./MemoryPurchaseOrderDb";
import { PurchaseOrderNumber } from "./PurchaseOrderNumber";
import { PurchaseOrderRepo } from "./PurchaseOrderRepo";

export const MemoryPurchaseOrderRepo = {
  new: (db: MemoryPurchaseOrderDb): PurchaseOrderRepo => {
    const counters: Record<string, number> = {};

    return {
      nextPoNumber: (org) => {
        // Ensure the prefix can generate a legal PO number before incrementing
        if (!PurchaseOrderNumber.check(`${org.namespace}-000001`)) {
          return ErrAsync(
            new Error(`"${org.namespace}" is not a valid purchase order prefix`)
          );
        }

        counters[org.namespace] = (counters[org.namespace] ?? 0) + 1;

        return OkAsync(
          `${org.namespace}-${counters[org.namespace]
            .toFixed()
            .padStart(6, "0")}` as PurchaseOrderNumber
        );
      },

      save: (po) => {
        db.purchaseOrders = db.purchaseOrders.filter(({ id }) => id !== po.id);
        db.purchaseOrders.push(po);
        return OkAsync(null);
      },

      fetch: (id) =>
        R.pipe(
          db.purchaseOrders,
          R.find(R.hasSubObject({ id })),
          Option.nonNull,
          OkAsync
        ),

      list: () => OkAsync(db.purchaseOrders),
    };
  },
};
