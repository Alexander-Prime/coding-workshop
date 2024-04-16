import { P, match } from "ts-pattern";

import { NonEmptyArray } from "../../utilities/NonEmptyArray";
import { UUID, createUuid, isUuid } from "../../utilities/uuid";
import { LineItem } from "./LineItem";

export type PurchaseOrder = { id: UUID; lineItems: NonEmptyArray<LineItem> };

export const PurchaseOrder = {
  new: (lineItems: NonEmptyArray<LineItem>): PurchaseOrder => ({
    id: createUuid(),
    lineItems,
  }),

  parse: (s: unknown): s is PurchaseOrder =>
    match(s)
      .with({ id: P.when(isUuid), lineItems: P.array() }, () => true)
      .otherwise(() => false),
};
