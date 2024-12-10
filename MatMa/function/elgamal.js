const bigintCryptoUtils = require("bigint-crypto-utils");

// Hàm tạo khóa ElGamal
async function generateElGamalKeys(bitLength = 1024) {
    const p = await generateLargePrime(bitLength);
    const g = 2n;
    const x = bigintCryptoUtils.randBetween(1n, p - 1n);
    const h = bigintCryptoUtils.modPow(g, x, p);

    return {
        publicKey: { p, g, h },
        privateKey: x,
    };
}

// Hàm mã hóa ElGamal
function elGamalEncrypt(message, publicKey) {
    const { p, g, h } = publicKey;
    const k = bigintCryptoUtils.randBetween(1n, p - 1n);
    const c1 = bigintCryptoUtils.modPow(g, k, p);
    const s = bigintCryptoUtils.modPow(h, k, p);
    const c2 = (BigInt(message) * s) % p;

    return { c1, c2 };
}

// Hàm giải mã ElGamal
function elGamalDecrypt(cipher, privateKey, p) {
    const { c1, c2 } = cipher;
    const s = bigintCryptoUtils.modPow(c1, privateKey, p);
    const sInv = bigintCryptoUtils.modInv(s, p);
    return (c2 * sInv) % p;
}
