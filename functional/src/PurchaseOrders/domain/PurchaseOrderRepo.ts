import { ResultAsync } from "neverthrow";

import { Option } from "../../utilities/option";
import { Uuid } from "../../utilities/uuid";
import { PurchaseOrder } from "./PurchaseOrder";

export type PurchaseOrderRepo = {
  save: (po: PurchaseOrder) => ResultAsync<null, Error>;
  fetch: (id: Uuid) => ResultAsync<Option<PurchaseOrder>, Error>;
};
