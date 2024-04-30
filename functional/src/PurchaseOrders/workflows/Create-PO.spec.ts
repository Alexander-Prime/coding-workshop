import { err as Err, ok as Ok, ResultAsync } from "neverthrow";
import * as R from "remeda";
import { P, match } from "ts-pattern";

import { None, Option, Some } from "../../utilities/option";
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
    const poResult = await createPO({ PORepo: repo })("syn", [LineItem.mock()]);
    const id = poResult._unsafeUnwrap();

    expect(poResult).toMatchObject(Ok({}));
    expect(Uuid.parse(id)).toEqual(Ok(id));
  });

  it("saves a purchase order to a repository", async () => {
    const repo = MemoryPurchaseOrderRepo.new();
    const result = await createPO({ PORepo: repo })("syn", [LineItem.mock()]);
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

  it("creates purchase orders with sequential PO numbers", async () => {
    const repo = MemoryPurchaseOrderRepo.new();

    const ids = await ResultAsync.combine([
      createPO({ PORepo: repo })("syn", [LineItem.mock()]),
      createPO({ PORepo: repo })("syn", [LineItem.mock()]),
      createPO({ PORepo: repo })("syn", [LineItem.mock()]),
      createPO({ PORepo: repo })("syn", [LineItem.mock()]),
      createPO({ PORepo: repo })("syn", [LineItem.mock()]),
    ]).unwrapOr([] as Uuid[]);

    const results = await ResultAsync.combine(
      ids.map((id) => repo.fetch(id))
    ).unwrapOr([] as Option<PurchaseOrder>[]);

    expect(results.map((r) => r.unwrap().poNumber)).toEqual([
      "syn-000001",
      "syn-000002",
      "syn-000003",
      "syn-000004",
      "syn-000005",
    ]);
  });
});
