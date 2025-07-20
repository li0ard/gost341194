import { hexToBytes } from "@li0ard/gost3413/dist/utils";
import { sboxes } from "@li0ard/magma";

export const DEFAULT_SBOX = sboxes.ID_GOSTR_3411_94_CRYPTOPRO_PARAM_SET;
export const BLOCKSIZE = 32;
export const C2 = new Uint8Array(32);
export const C3 = hexToBytes("ff00ffff000000ffff0000ff00ffff0000ff00ff00ff00ffff00ff00ff00ff00");
export const C4 = new Uint8Array(32);