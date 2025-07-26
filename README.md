<p align="center">
    <b>@li0ard/gost341194</b><br>
    <b>GOST R 34.11-94 hash function in pure TypeScript</b>
    <br>
    <a href="https://li0ard.is-cool.dev/gost341194">docs</a>
    <br><br>
    <a href="https://github.com/li0ard/gost341194/actions/workflows/test.yml"><img src="https://github.com/li0ard/gost341194/actions/workflows/test.yml/badge.svg" /></a>
    <a href="https://github.com/li0ard/gost341194/blob/main/LICENSE"><img src="https://img.shields.io/github/license/li0ard/gost341194" /></a>
    <br>
    <a href="https://npmjs.com/package/@li0ard/gost341194"><img src="https://img.shields.io/npm/v/@li0ard/gost341194" /></a>
    <a href="https://jsr.io/@li0ard/gost341194"><img src="https://jsr.io/badges/@li0ard/gost341194" /></a>
    <br>
    <hr>
</p>

## Installation

```bash
# from NPM
npm i @li0ard/gost341194

# from JSR
bunx jsr i @li0ard/gost341194
```

## Supported modes
- [x] Hash function
- [x] PBKDF2

## Features
- Provides simple and modern API
- Most of the APIs are strictly typed
- Fully complies with [GOST R 34.11-94 (RFC 5831)](https://datatracker.ietf.org/doc/html/rfc5831) standard
- Supports Bun, Node.js, Deno, Browsers

## Examples

```ts
import { Gost341194 } from "@li0ard/streebog"

let hash = new Gost341194()
hash.update(new TextEncoder().encode("hello world"))
console.log(hash.digest())
```