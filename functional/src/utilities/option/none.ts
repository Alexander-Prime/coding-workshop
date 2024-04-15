import { Err, err, Ok, ok } from "neverthrow";

import { Option } from "./option";
import { Some } from "./some";

export type None = {
  _kind: "None";

  and(): None;

  andThen(): None;

  expect(message: string): never;

  filter(): None;

  flatten(): None;

  inspect(): void;

  isNone(): true;

  isSome(): false;

  isSomeAnd(): false;

  map(): None;

  mapOr<U>(def: U): Some<U>;

  mapOrElse<U>(def: () => U): Some<U>;

  okOr<E>(err: E): Err<never, E>;

  okOrElse<E>(errFn: () => E): Err<never, E>;

  or<T>(def: Option<T>): Option<T>;

  orElse<T>(def: () => Option<T>): Option<T>;

  transpose(): Ok<None, never>;

  unwrap(): never;

  unwrapOr<T>(value: T): T;

  unwrapOrElse<T>(fn: () => T): T;

  unzip(): [];

  //xor<U>(other: Some<U>): None;
  //xor(other: None): Some<T>;
  xor<U extends Option<unknown>>(other: U): U;

  //zip<U>(other: Some<U>): Some<[T, U]>;
  //zip(other: None): None;
  zip(): None;

  //zipWith<U, R>(other: Some<U>, fn: (self: T, other: U) => R): Some<R>;
  //zipWith(other: None): None;
  zipWith(): None;

  [Symbol.iterator](): IterableIterator<never>;
};

export const None: None = {
  _kind: "None",

  and: () => None,

  andThen: () => None,

  expect: (message) => {
    throw new Error(message);
  },

  filter: () => None,

  flatten: () => None,

  inspect: () => {},

  isNone: () => true,

  isSome: () => false,

  isSomeAnd: () => false,

  map: () => None,

  mapOr<T>(def: T) {
    return Some(def);
  },

  mapOrElse<T>(def: () => T) {
    return Some(def());
  },

  okOr: <E>(e: E) => err(e),

  okOrElse: <E>(e: () => E) => err(e()),

  or: <T>(other: Option<T>) => other,

  orElse: <T>(other: () => Option<T>) => other(),

  transpose: () => ok(None),

  unwrap: () => {
    throw new Error("Tried to unwrap a None");
  },

  unwrapOr: <T>(def: T) => def,

  unwrapOrElse: <T>(def: () => T) => def(),

  unzip<U extends unknown[]>(this: Some<U>) {
    return this._value.map(Some) as { [k in keyof U]: Some<U[k]> };
  },

  xor: <T extends Option<unknown>>(other: T) => other,

  zip: () => None,

  zipWith: () => None,

  [Symbol.iterator]: function* <T>(this: Some<T>): IterableIterator<T> {},
};
