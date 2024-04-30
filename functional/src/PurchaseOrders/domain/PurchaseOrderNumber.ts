import { err as Err, ok as Ok, Result } from "neverthrow";

import { Brand } from "../../utilities/brand";

const poRegex = /^(\w+)-([0-9]{6})$/i;

class PoNumberParseError extends Error {}

export type PurchaseOrderNumber = Brand<string, "PurchaseOrderNumber">;

export const PurchaseOrderNumber = {
  parse: (
    maybePoNumber: unknown
  ): Result<PurchaseOrderNumber, PoNumberParseError> =>
    PurchaseOrderNumber.check(maybePoNumber)
      ? Ok(maybePoNumber)
      : Err(new PoNumberParseError()),

  check: (maybePoNumber: unknown): maybePoNumber is PurchaseOrderNumber =>
    poRegex.test(maybePoNumber as any),

  prefix: (num: PurchaseOrderNumber): string => num.match(poRegex)?.[1]!,

  value: (num: PurchaseOrderNumber): number => Number(num.match(poRegex)?.[2]),
};
