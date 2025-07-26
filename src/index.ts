import { bytesToNumberBE, concatBytes, numberToBytesBE, xor } from "@li0ard/gost3413/dist/utils";
import { type Sbox, encryptECB } from "@li0ard/magma";
import { BLOCKSIZE, C2, C3, C4, DEFAULT_SBOX } from "./const";

const A = (x: Uint8Array) => {
    let x2 = x.slice(16, 24),
        x1 = x.slice(24, 32);
    
    return concatBytes(xor(x1, x2), x.slice(0, 8), x.slice(8, 16), x2);
}

const P = (x: Uint8Array) => {
    return new Uint8Array([x[0], x[8], x[16], x[24], x[1], x[9], x[17], x[25], x[2], x[10], x[18], x[26], x[3], x[11], x[19], x[27], x[4], x[12], x[20], x[28], x[5], x[13], x[21], x[29], x[6], x[14], x[22], x[30], x[7], x[15], x[23], x[31]]);
}

/** Chi function (looks like LFSR) */
const _chi = (Y: Uint8Array) => {
    const byx = new Uint8Array(2);
    byx[0] = Y[30] ^ Y[28] ^ Y[26] ^ Y[24] ^ Y[6] ^ Y[0];
    byx[1] = Y[31] ^ Y[29] ^ Y[27] ^ Y[25] ^ Y[7] ^ Y[1];

    const result = new Uint8Array(32);
    result.set(byx, 0);
    for (let i = 0; i < 30; i += 2) {
        result[i + 2] = Y[i];
        result[i + 3] = Y[i + 1];
    }

    return result;
}

/** Step function */
const _step = (hin: Uint8Array, m: Uint8Array, sbox: Sbox) => {
    // Generate keys
    let u = hin;
    let v = m;
    let w = xor(hin, m);
    let k1 = P(w);

    u = xor(A(u), C2);
    v = A(A(v));
    w = xor(u, v);
    let k2 = P(w);

    u = xor(A(u), C3);
    v = A(A(v));
    w = xor(u, v);
    let k3 = P(w);

    u = xor(A(u), C4);
    v = A(A(v));
    w = xor(u, v);
    let k4 = P(w);

    // Encrypt
    let s = concatBytes(
        encryptECB(k4.slice().reverse(), hin.slice(0, 8).reverse(), true, sbox).reverse(),
        encryptECB(k3.slice().reverse(), hin.slice(8, 16).reverse(), true, sbox).reverse(),
        encryptECB(k2.slice().reverse(), hin.slice(16, 24).reverse(), true, sbox).reverse(),
        encryptECB(k1.slice().reverse(), hin.slice(24, 32).reverse(), true, sbox).reverse()
    );

    // Permute
    let x = new Uint8Array(s);

    for(let i = 0; i < 12; i++) x = _chi(x);
    x = xor(x, m);
    x = _chi(x);
    x = xor(hin, x);
    for(let i = 0; i < 61; i++) x = _chi(x);

    return x;
}

/** GOST R 34.11-94 class */
export class Gost341194 {
    public readonly blockLen: number = BLOCKSIZE;
    public readonly outputLen = 32;

    /**
     * GOST R 34.11-94 constructor
     * @param data Data to be hashed (optional, can be updated using `update` method)
     * @param sbox S-Box (optional, default is `ID_GOSTR_3411_94_CRYPTOPRO_PARAM_SET`)
     */
    constructor(private data: Uint8Array = new Uint8Array(), private sbox: Sbox = DEFAULT_SBOX) {}

    /** Create hash instance */
    public static create(): Gost341194 { return new Gost341194(); }

    /** Reset hash state */
    reset() { this.data = new Uint8Array(); }
    /** Reset hash state */
    destroy() { this.reset(); }

    /** Clone hash instance */
    clone(): Gost341194 { return this._cloneInto(); }
    _cloneInto(to?: Gost341194): Gost341194 {
        to ||= new Gost341194();
        to.data = this.data.slice();
        to.sbox = this.sbox;

        return to;
    }

    /** Update hash buffer */
    update(data: Uint8Array): this {
        this.data = concatBytes(this.data, data);
        return this;
    }

    /**
     * Finalize hash computation and write result into Uint8Array
     * @param buf Output Uint8Array
     */
    digestInto(buf: Uint8Array): Uint8Array {
        let len = 0n;
        let checksum = 0n;
        let h = new Uint8Array(32);
        let m = new Uint8Array(this.data);

        for(let i = 0; i < m.length; i += BLOCKSIZE) {
            let part: Uint8Array = m.slice(i, i + BLOCKSIZE).reverse();
            len += BigInt(part.length) * 8n;

            checksum = (checksum + bytesToNumberBE(part)) & 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;
            if(part.length < BLOCKSIZE) part = numberToBytesBE(bytesToNumberBE(part), BLOCKSIZE);
            h = _step(h, part, this.sbox);
        }

        h = _step(
            _step(h, numberToBytesBE(len, BLOCKSIZE), this.sbox),
            numberToBytesBE(checksum, BLOCKSIZE),
            this.sbox
        );
        buf.set(h.reverse());
        this.reset();
        return buf;
    }

    /** Finalize hash computation and return result as Uint8Array */
    digest(): Uint8Array { return this.digestInto(new Uint8Array(this.outputLen)); }
}

/**
 * Compute hash with GOST R 34.11-94
 * @param input Input bytes
 */
export const gost341194 = (input: Uint8Array): Uint8Array => new Gost341194().update(input).digest();

export * from "./pbkdf2";