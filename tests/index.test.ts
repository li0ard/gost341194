import { describe, test, expect } from "bun:test"
import { Gost341194, gost341194 } from "../src"
import { sboxes } from "@li0ard/magma"
import { randomBytes } from "crypto"

test("Test symmetric", () => {
    let chunks: Buffer[] = []
    for(let i = 0; i < 10; i++) {
        chunks.push(randomBytes(10))
    }

    let m = new Gost341194()
    for(let i of chunks) {
        m.update(i)
    }
    expect(m.digest()).toStrictEqual(gost341194(Buffer.concat(chunks)))
})

describe("Test vectors", () => {
    test("Test param set", () => {
        let test_vectors = [
            ["a", "d42c539e367c66e9c88a801f6649349c21871b4344c6a573f849fdce62f314dd"],
            ["abc", "f3134348c44fb1b2a277729e2285ebb5cb5e0f29c975bc753b70497c06a4d51d"],
            ["message digest", "ad4434ecb18f2c99b60cbe59ec3d2469582b65273f48de72db2fde16a4889a4d"],
            ["The quick brown fox jumps over the lazy dog", "77b7fa410c9ac58a25f49bca7d0468c9296529315eaca76bd1a10f376d1f4294"],
            ["The quick brown fox jumps over the lazy cog", "a3ebc4daaab78b0be131dab5737a7f67e602670d543521319150d2e14eeec445"],
            ["This is message, length=32 bytes", "b1c466d37519b82e8319819ff32595e047a28cb6f83eff1c6916a815a637fffa"],
            ["Suppose the original message has length = 50 bytes", "471aba57a60a770d3a76130635c1fbea4ef14de51f78b4ae57dd893b62f55208"]
        ]

        for (let [input, expected] of test_vectors) {
            const a = new Gost341194(new Uint8Array(), sboxes.ID_GOSTR_3411_94_TEST_PARAM_SET)
            a.update(new TextEncoder().encode(input))
            expect(a.digest()).toStrictEqual(Buffer.from(expected, "hex"))
        }
    })

    test("CryptoPro param set", () => {
        let test_vectors = [
            ["a", "e74c52dd282183bf37af0079c9f78055715a103f17e3133ceff1aacf2f403011"],
            ["abc", "b285056dbf18d7392d7677369524dd14747459ed8143997e163b2986f92fd42c"],
            ["message digest", "bc6041dd2aa401ebfa6e9886734174febdb4729aa972d60f549ac39b29721ba0"],
            ["The quick brown fox jumps over the lazy dog", "9004294a361a508c586fe53d1f1b02746765e71b765472786e4770d565830a76"],
            ["This is message, length=32 bytes", "2cefc2f7b7bdc514e18ea57fa74ff357e7fa17d652c75f69cb1be7893ede48eb"],
            ["Suppose the original message has length = 50 bytes", "c3730c5cbccacf915ac292676f21e8bd4ef75331d9405e5f1a61dc3130a65011"]
        ]

        for (let [input, expected] of test_vectors) {
            const a = new Gost341194()
            a.update(new TextEncoder().encode(input))
            expect(a.digest()).toStrictEqual(Buffer.from(expected, "hex"))
        }
    })
})

test("Clone", () => {
    let m = new Gost341194(new TextEncoder().encode("foo"))
    let c = m.clone()
    c.update(new TextEncoder().encode("bar"))
    m.update(new TextEncoder().encode("bar"))

    expect(c.digest()).toStrictEqual(m.digest())
})