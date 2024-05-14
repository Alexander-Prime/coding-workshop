import { Uuid } from "../../utilities/uuid";

export type Org = {
  namespace: string;
};

export type Purchaser = {
  id: Uuid;
  org: Org;
};

export const Purchaser = {
  new: (org: Org) => ({ id: Uuid.v4(), org }),
};
