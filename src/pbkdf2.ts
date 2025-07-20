import { Gost341194 } from "./index";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { createHasher } from "@noble/hashes/utils";

/**
 * PBKDF2 implementation for GOST R 34.11-94
 * @param password Password from which a derived key is generated
 * @param salt Salt
 * @param iterations Number of iterations (aka work factor)
 * @param dkLen Output length
 */
export const Gost341194PBKDF2 = (password: Uint8Array, salt: Uint8Array, iterations: number, dkLen: number): Uint8Array => {
    return pbkdf2(createHasher(Gost341194.create), password, salt, { c: iterations, dkLen });
}