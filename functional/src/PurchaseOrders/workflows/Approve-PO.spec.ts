import { err as Err } from "neverthrow";
import { DomainInvariantViolation } from "../../utilities/error/DomainInvariantViolation";
import { Some } from "../../utilities/option";
import { LineItem } from "../domain/LineItem";
import { MemoryPurchaseOrderRepo } from "../domain/MemoryPurchaseOrderRepo";
import { Purchaser } from "../domain/Purchaser";
import { Reviewer } from "../domain/Reviewer";
import { approvePO } from "./Approve-PO";
import { createPO } from "./Create-PO";
import { submitPO } from "./Submit-PO";

const setup = async () => {
  const PORepo = MemoryPurchaseOrderRepo.new();

  const purchaser = Purchaser.new({ namespace: "syn" });
  const reviewer = Reviewer.new();

  const poId = (
    await createPO({ PORepo })(purchaser, [LineItem.mock()])
  )._unsafeUnwrap();

  return { PORepo, purchaser, reviewer, poId };
};

describe("Approve PO workflow", () => {
  it("applies the reviewer to the purchase order", async () => {
    const { PORepo, reviewer, poId } = await setup();

    (await submitPO({ PORepo })(poId))._unsafeUnwrap();
    (await approvePO({ PORepo })(reviewer, poId))._unsafeUnwrap();

    const result = (await PORepo.fetch(poId))._unsafeUnwrap().unwrap();

    expect(result.reviewedBy).toEqual(Some(reviewer));
  });

  it("throws an error if the purchase order has already been approved", async () => {
    const { PORepo, reviewer, poId } = await setup();

    (await submitPO({ PORepo })(poId))._unsafeUnwrap();
    (await approvePO({ PORepo })(reviewer, poId))._unsafeUnwrap();

    const result = await approvePO({ PORepo })(reviewer, poId);
    expect(result).toEqual(Err(expect.anything()));
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(DomainInvariantViolation);
    expect(result._unsafeUnwrapErr()).toHaveProperty(
      "message",
      expect.stringMatching(/^Can't approve an order that isn't pending/)
    );
  });
});
