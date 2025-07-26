import { describe, test, expect } from "bun:test"
import { Gost341194PBKDF2 } from "../src"

describe("PBKDF2", () => {
    let p = Buffer.from("password")
    let s = Buffer.from("salt")
    test("#1", () => {
        let expected = Buffer.from("7314e7c04fb2e662c543674253f68bd0b73445d07f241bed872882da21662d58", "hex")
        expect(Gost341194PBKDF2(p, s, 1, 32)).toStrictEqual(expected)
    })

    test("#2", () => {
        let expected = Buffer.from("990dfa2bd965639ba48b07b792775df79f2db34fef25f274378872fed7ed1bb3", "hex")
        expect(Gost341194PBKDF2(p, s, 2, 32)).toStrictEqual(expected)
    })
})