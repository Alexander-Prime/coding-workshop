import { None } from "./none";
import { Some } from "./some";

export type Option<T> = Some<T> | None;

export const Option = {
  nonNull: <T>(value: T | null | undefined): Option<T> =>
    value === null || value === undefined ? None : Some(value),

  truthy: <T>(value: T | null | undefined): Option<T> =>
    value ? Some(value) : None,
};
