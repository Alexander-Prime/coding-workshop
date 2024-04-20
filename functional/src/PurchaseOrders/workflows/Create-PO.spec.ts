import { err as Err, ok as Ok } from "neverthrow";
import * as R from "remeda";
import { P, match } from "ts-pattern";

import { None, Some } from "../../utilities/option";
import { Uuid } from "../../utilities/uuid";
import { LineItem } from "../domain/LineItem";
import { MemoryPurchaseOrderRepo } from "../domain/MemoryPurchaseOrderRepo";
import { PurchaseOrder } from "../domain/PurchaseOrder";
import { createPO } from "./Create-PO";

describe("Create PO Workflow", () => {
  it("is callable", () => {
    const repo = MemoryPurchaseOrderRepo.new();
    createPO({ PORepo: repo });
  });

  it("returns a uuid", async () => {
    const repo = MemoryPurchaseOrderRepo.new();
    const poResult = await createPO({ PORepo: repo })([LineItem.mock()]);
    const id = poResult._unsafeUnwrap();

    expect(poResult).toMatchObject(Ok({}));
    expect(Uuid.parse(id)).toEqual(Ok(id));
  });

  it("saves a purchase order to a repository", async () => {
    const repo = MemoryPurchaseOrderRepo.new();
    const result = await createPO({ PORepo: repo })([LineItem.mock()]);
    const id = result._unsafeUnwrap();
    const poRes = await repo.fetch(id);
    const output = match(poRes)
      .with(Ok(Some(P.select())), R.identity)
      .with(Ok(None), R.constant("No results for that search."))
      .with(Err(P.select()), (err) => `Error: ${err}`)
      .otherwise(R.constant("Unknown variant"));

    expect(PurchaseOrder.check(output)).toBeTruthy();

    if (PurchaseOrder.check(output)) {
      expect(output.id).toEqual(id);
    }
  });
});
