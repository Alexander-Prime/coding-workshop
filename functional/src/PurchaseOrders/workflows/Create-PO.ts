import { NonEmptyArray } from "../../utilities/NonEmptyArray";
import { LineItem } from "../domain/LineItem";
import { PurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseOrderRepo } from "../domain/PurchaseOrderRepo";

export const createPO =
  ({ PORepo }: { PORepo: PurchaseOrderRepo }) =>
  async (lineItems: NonEmptyArray<LineItem>) => {
    const purchaseOrder = PurchaseOrder.new(lineItems);
    const res = await PORepo.save(purchaseOrder);
    return res.map(() => purchaseOrder.id);
  };
