/** All endpoints should return with this format. */
export type APIResult<T> = {
  error: boolean;
  message: string;
  value?: T | undefined;
};

/** Type returned by `Result.anticipate` for error handling. */
export type ResultErr = {
  error: boolean;
  message: string;
};

/** A class which requires error handling before obtaining a value. */
export class Result<T> {
  #error: boolean;
  #message: string;
  #value: T | undefined = undefined;
  #handledError = false;

  constructor(src: {
    error: boolean;
    message: string;
    value?: T | undefined | null;
  }) {
    if (src.message.length == 0) {
      throw new Error(
        `Illegal arguments for constructing result: result message cannot be empty.`,
      );
    }

    if (src.value !== undefined && src.value !== null) {
      if (src.error) {
        throw new Error(
          "Illegal arguments for constructing result: `error` cannot be true if `value` is defined.",
        );
      }
      this.#value = src.value;
    } else if (!src.error) {
      throw new Error(
        "Illegal arguments for constructing result: `error` cannot be false if `value` is undefined or null.",
      );
    }

    this.#error = src.error;
    this.#message = src.message;
  }

  /** Returns if there was an error and the result's message. Allows for `unwrap` to be called. */
  anticipate(): ResultErr {
    this.#handledError = true;
    return {
      error: this.#error,
      message: this.#message,
    };
  }

  /** Requires `anticipate` to be called. Returns actual value of Result. */
  unwrap(): T {
    if (!this.#handledError) {
      throw new Error(`Unwrapped result before anticipating error.`);
    }
    if (this.#error) {
      throw new Error(`Unwrapped result with error: ${this.#message}`);
    }
    return this.#value!;
  }
}
