import { ResultAsync } from "neverthrow";
import { isPromise } from "remeda";

type Fn<A extends unknown[], R> = (...args: A) => R;

export const fromAsync = <T extends unknown[], U, E = Error>(
  fn: (...args: T) => U | Promise<U>,
): Fn<T, ResultAsync<U, E>> =>
(...args: T) => {
  const value = fn(...args);
  return ResultAsync.fromPromise(
    isPromise(value) ? value : Promise.resolve(value),
    (e) => e as E,
  );
};
