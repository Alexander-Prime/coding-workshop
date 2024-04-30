import { ResultAsync } from "neverthrow";

import { NonEmptyArray } from "../../utilities/NonEmptyArray";
import { Uuid } from "../../utilities/uuid";
import { LineItem } from "../domain/LineItem";
import { PurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseOrderRepo } from "../domain/PurchaseOrderRepo";

export const createPO =
  ({ PORepo }: { PORepo: PurchaseOrderRepo }) =>
  (
    prefix: string,
    lineItems: NonEmptyArray<LineItem>
  ): ResultAsync<Uuid, Error> =>
    PORepo.nextPoNumber(prefix)
      .map((poNum) => PurchaseOrder.new(poNum, lineItems))
      .andThen((po) => PORepo.save(po).map(() => po.id));
