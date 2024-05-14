import { ResultAsync } from "neverthrow";

import { NonEmptyArray } from "../../utilities/NonEmptyArray";
import { Uuid } from "../../utilities/uuid";
import { LineItem } from "../domain/LineItem";
import { PurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseOrderRepo } from "../domain/PurchaseOrderRepo";
import { Purchaser } from "../domain/Purchaser";

export const createPO =
  ({ PORepo }: { PORepo: PurchaseOrderRepo }) =>
  (
    purchaser: Purchaser,
    lineItems: NonEmptyArray<LineItem>
  ): ResultAsync<Uuid, Error> => {
    const po = PurchaseOrder.new(purchaser, lineItems);
    return PORepo.save(po).map(() => po.id);
  };
