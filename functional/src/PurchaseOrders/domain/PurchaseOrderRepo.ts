import { ResultAsync } from "neverthrow";
import { P } from "ts-pattern";

import { Option } from "../../utilities/option";
import { Uuid } from "../../utilities/uuid";
import { PurchaseOrder } from "./PurchaseOrder";
import { PurchaseOrderNumber } from "./PurchaseOrderNumber";
import { Org } from "./Purchaser";

export type PurchaseOrderRepo = {
  nextPoNumber: (org: Org) => ResultAsync<PurchaseOrderNumber, Error>;
  save: (po: PurchaseOrder) => ResultAsync<null, Error>;
  fetch: (id: Uuid) => ResultAsync<Option<PurchaseOrder>, Error>;
  list: <T extends PurchaseOrder>(
    pattern?: P.Pattern<T>
  ) => ResultAsync<T[], Error>;
};
