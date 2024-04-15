import { Ok, ok, Result } from "neverthrow";

import { None } from "./none";
import { Option } from "./option";

export type Some<T> = {
  _kind: "Some";
  _value: T;

  and<U>(other: Option<U>): Option<U>;

  andThen<U>(fn: (value: T) => Option<U>): Option<U>;

  expect(): T;

  filter<U extends T>(fn: (value: T) => value is U): Option<U>;
  filter(fn: (value: T) => boolean): Option<T>;

  flatten<U extends Option<unknown>>(this: Some<U>): U;

  inspect(fn: (value: T) => void): void;

  isNone(): false;

  isSome(): true;

  //isSomeAnd<U extends T>(fn: (value: T) => value is U): this is Some<U>;
  isSomeAnd(fn: (value: T) => boolean): boolean;

  map<U>(fn: (value: T) => U): Some<U>;

  mapOr<U, V>(def: U, fn: (value: T) => V): Some<V>;

  mapOrElse<U, V>(def: () => U, fn: (value: T) => V): Some<V>;

  okOr(): Ok<T, never>;

  okOrElse(): Ok<T, never>;

  or(): Some<T>;

  orElse(): Some<T>;

  transpose<E>(this: Some<Result<T, E>>): Result<Some<T>, E>;

  unwrap(): T;

  unwrapOr(): T;

  unwrapOrElse(): T;

  unzip<U extends unknown[]>(this: Some<U>): { [k in keyof U]: Some<U[k]> };

  //xor<U>(other: Some<U>): None;
  //xor(other: None): Some<T>;
  xor<U>(other: Option<U>): Option<T | U>;

  //zip<U>(other: Some<U>): Some<[T, U]>;
  //zip(other: None): None;
  zip<U>(other: Option<U>): Option<[T, U]>;

  //zipWith<U, R>(other: Some<U>, fn: (self: T, other: U) => R): Some<R>;
  //zipWith(other: None): None;
  zipWith<U, R>(other: Option<U>, fn: (self: T, other: U) => R): Option<R>;

  [Symbol.iterator](): IterableIterator<T>;
};

const impl = {
  and<U>(other: Option<U>) {
    return other;
  },

  andThen<T, U>(this: Some<T>, fn: (value: T) => Option<U>) {
    return fn(this._value);
  },

  expect<T>(this: Some<T>) {
    return this._value;
  },

  filter<T>(this: Some<T>, fn: (value: T) => boolean) {
    return fn(this._value) ? this : None;
  },

  flatten<T extends Option<unknown>>(this: Some<T>) {
    return this._value;
  },

  inspect<T>(this: Some<T>, fn: (value: T) => void) {
    fn(this._value);
  },

  isNone(): false {
    return false;
  },

  isSome(): true {
    return true;
  },

  isSomeAnd<T>(this: Some<T>, fn: (value: T) => boolean) {
    return fn(this._value);
  },

  map<T, U>(this: Some<T>, fn: (value: T) => U) {
    return Some(fn(this._value));
  },

  mapOr<T, V>(this: Some<T>, _def: unknown, fn: (value: T) => V) {
    return Some(fn(this._value));
  },

  mapOrElse<T, V>(this: Some<T>, _def: unknown, fn: (value: T) => V) {
    return Some(fn(this._value));
  },

  okOr<T>(this: Some<T>) {
    return ok(this._value);
  },

  okOrElse<T>(this: Some<T>) {
    return ok(this._value);
  },

  or<T>(this: Some<T>) {
    return this;
  },

  orElse<T>(this: Some<T>) {
    return this;
  },

  transpose<T, E>(this: Some<Result<T, E>>) {
    return this._value.map((t) => Some(t));
  },

  unwrap<T>(this: Some<T>) {
    return this._value;
  },

  unwrapOr<T>(this: Some<T>) {
    return this._value;
  },

  unwrapOrElse<T>(this: Some<T>) {
    return this._value;
  },

  unzip<U extends unknown[]>(this: Some<U>) {
    return this._value.map(Some) as { [k in keyof U]: Some<U[k]> };
  },

  xor<T, U>(this: Some<T>, other: Option<U>): Option<T | U> {
    return other.isSome() ? None : this;
  },

  zip<T, U>(this: Some<T>, other: Option<U>): Option<[T, U]> {
    return other.isSome()
      ? Some([this._value, other.unwrap()] as [T, U])
      : None;
  },

  zipWith<T, U, R>(
    this: Some<T>,
    other: Option<U>,
    fn: (self: T, other: U) => R
  ) {
    return other.isSome() ? Some(fn(this._value, other.unwrap())) : None;
  },

  [Symbol.iterator]: function* <T>(this: Some<T>): IterableIterator<T> {
    yield this._value;
  },
};

export const Some = <T>(value: T): Some<T> => {
  const some: Some<T> = {
    _kind: "Some",
    _value: value,

    ...impl,
  };

  for (const key of Object.keys(impl)) {
    Object.defineProperty(some, key, { enumerable: false });
  }

  return some as Some<T>;
};
