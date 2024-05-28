import { Uuid } from "../../utilities/uuid";

export type Reviewer = {
  id: Uuid;
};

export const Reviewer = {
  new: () => ({ id: Uuid.v4() }),
};
