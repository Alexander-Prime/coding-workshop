import { err as Err, ok as Ok, Result } from "neverthrow";
import { v4 } from "uuid";

import { Brand } from "./brand";

const v4Regex =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

class UuidParseError extends Error {}

export type Uuid = Brand<string, "Uuid">;

export const Uuid = {
  v4: () => v4() as Uuid,

  parse: (maybeUuid: unknown): Result<Uuid, UuidParseError> =>
    Uuid.check(maybeUuid) ? Ok(maybeUuid) : Err(new UuidParseError()),

  check: (maybeUuid: unknown): maybeUuid is Uuid =>
    v4Regex.test(maybeUuid as any),
};
