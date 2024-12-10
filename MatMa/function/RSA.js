// Hàm tạo khóa RSA
function generateRSAKeys(keySize = 1024) {
    if (keySize < 512) {
        throw new Error("Key size too small. Must be at least 512 bits.");
    }

    const forge = require("node-forge");
    const keypair = forge.pki.rsa.generateKeyPair({ bits: keySize, e: 0x10001 });

    return {
        publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
        privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
    };
}

// Hàm mã hóa RSA
function rsaEncrypt(plainText) {
    if (!plainText || typeof plainText !== "string") {
        throw new Error("Invalid plain text input. Must be a non-empty string.");
    }

    const forge = require("node-forge");
    const { publicKey, privateKey } = generateRSAKeys();

    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = publicKeyObj.encrypt(forge.util.encodeUtf8(plainText), "RSA-OAEP");

    return {
        cipherText: forge.util.encode64(encrypted),
        key: privateKey,
    };
}

// Hàm giải mã RSA
function rsaDecrypt(cipherText, privateKeyPem) {
    if (!cipherText || typeof cipherText !== "string") {
        throw new Error("Invalid cipher text input. Must be a non-empty string.");
    }

    if (!privateKeyPem || typeof privateKeyPem !== "string") {
        throw new Error("Invalid private key input. Must be a valid PEM string.");
    }

    const forge = require("node-forge");
    const privateKeyObj = forge.pki.privateKeyFromPem(privateKeyPem);

    const encryptedBytes = forge.util.decode64(cipherText);
    const decrypted = privateKeyObj.decrypt(encryptedBytes, "RSA-OAEP");

    return forge.util.decodeUtf8(decrypted);
}

// Xuất các hàm
if (typeof module !== "undefined") {
    module.exports = { rsaEncrypt, rsaDecrypt, generateRSAKeys };
}
