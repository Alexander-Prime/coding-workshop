import { okAsync as OkAsync, ResultAsync } from "neverthrow";
import { prop } from "remeda";

import { NonEmptyArray } from "../../utilities/NonEmptyArray";
import { Uuid } from "../../utilities/uuid";
import { LineItem } from "../domain/LineItem";
import { PurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseOrderRepo } from "../domain/PurchaseOrderRepo";
import { Purchaser } from "../domain/Purchaser";

const asyncEffect =
  <T, E>(fn: (value: T) => ResultAsync<unknown, E>) =>
  (value: T): ResultAsync<T, E> =>
    fn(value).map(() => value);

export const createPO =
  ({ PORepo }: { PORepo: PurchaseOrderRepo }) =>
  (
    purchaser: Purchaser,
    lineItems: NonEmptyArray<LineItem>
  ): ResultAsync<Uuid, Error> =>
    OkAsync(PurchaseOrder.new(purchaser, lineItems))
      .andThen(asyncEffect(PORepo.save))
      .map(prop("id"));
