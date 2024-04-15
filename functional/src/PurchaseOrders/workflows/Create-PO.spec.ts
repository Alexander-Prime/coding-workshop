import { err, ok } from "neverthrow";
import { constant, identity } from "remeda";
import { P, match } from "ts-pattern";

import { None, Some } from "../../utilities/option";
import { isUuid } from "../../utilities/uuid";
import { constructPORepository } from "../domain/PORepistory";
import { isPurchaseOrder } from "../domain/PurchaseOrder";
import { createPO } from "./Create-PO";

describe("Create PO Workflow", () => {
  it("is callable", () => {
    const repo = constructPORepository();
    createPO({ PORepo: repo });
  });

  it("returns a uuid", async () => {
    const repo = constructPORepository();
    const poResult = await createPO({ PORepo: repo })();
    const id = poResult._unsafeUnwrap();
    expect(poResult.isOk()).toBeTruthy();
    expect(isUuid(id)).toBeTruthy();
  });

  it("saves a purchase order to a repository", async () => {
    const repo = constructPORepository();
    const result = await createPO({ PORepo: repo })();
    const id = result._unsafeUnwrap();
    const poRes = await repo.fetch(id);
    const output = match(poRes)
      .with(ok(Some(P.select())), identity)
      .with(ok(None), constant("No results for that search."))
      .with(err(P.select()), (err) => `Error: ${err}`)
      .otherwise(constant("Unknown variant"));

    expect(isPurchaseOrder(output)).toBeTruthy();
    if (isPurchaseOrder(output)) {
      expect(id).toEqual(output.id);
    }
  });
});
