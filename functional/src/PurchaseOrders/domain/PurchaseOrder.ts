import { err as Err, ok as Ok } from "neverthrow";
import { P, match } from "ts-pattern";

import { NonEmptyArray } from "../../utilities/NonEmptyArray";
import { Uuid } from "../../utilities/uuid";
import { LineItem } from "./LineItem";

export type PurchaseOrder = { id: Uuid; lineItems: NonEmptyArray<LineItem> };

export const PurchaseOrder = {
  new: (lineItems: NonEmptyArray<LineItem>): PurchaseOrder => ({
    id: Uuid.v4(),
    lineItems,
  }),

  parse: (s: unknown) => (PurchaseOrder.check(s) ? Ok(s) : Err(new Error())),

  check: (s: unknown): s is PurchaseOrder =>
    match(s)
      .with({ id: P.when(Uuid.check), lineItems: P.array() }, () => true)
      .otherwise(() => false),
};
