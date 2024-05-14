import { err as Err, ok as Ok, ResultAsync } from "neverthrow";
import * as R from "remeda";
import { P, match } from "ts-pattern";

import { None, Option, Some } from "../../utilities/option";
import { Uuid } from "../../utilities/uuid";
import { LineItem } from "../domain/LineItem";
import { MemoryPurchaseOrderRepo } from "../domain/MemoryPurchaseOrderRepo";
import { PurchaseOrder } from "../domain/PurchaseOrder";
import { Purchaser } from "../domain/Purchaser";
import { createPO } from "./Create-PO";

describe("Create PO Workflow", () => {
  it("is callable", () => {
    const repo = MemoryPurchaseOrderRepo.new();
    createPO({ PORepo: repo });
  });

  it("returns a uuid", async () => {
    const repo = MemoryPurchaseOrderRepo.new();
    const purchaser = Purchaser.new({ namespace: "syn" });
    const poResult = await createPO({ PORepo: repo })(purchaser, [
      LineItem.mock(),
    ]);
    const id = poResult._unsafeUnwrap();

    expect(poResult).toMatchObject(Ok({}));
    expect(Uuid.parse(id)).toEqual(Ok(id));
  });

  it("saves a purchase order to a repository", async () => {
    const repo = MemoryPurchaseOrderRepo.new();
    const purchaser = Purchaser.new({ namespace: "syn" });
    const result = await createPO({ PORepo: repo })(purchaser, [
      LineItem.mock(),
    ]);
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

  it("creates purchase orders without PO numbers", async () => {
    const repo = MemoryPurchaseOrderRepo.new();
    const purchaser = Purchaser.new({ namespace: "syn" });

    const ids = await ResultAsync.combine([
      createPO({ PORepo: repo })(purchaser, [LineItem.mock()]),
    ]).unwrapOr([] as Uuid[]);

    const results = await ResultAsync.combine(ids.map(repo.fetch)).unwrapOr(
      [] as Option<PurchaseOrder>[]
    );

    expect(results.map((r) => r.unwrap().poNumber)).toEqual([None]);
  });
});
