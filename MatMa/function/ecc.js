// Sử dụng thư viện Elliptic
const ec = new elliptic.ec("secp256k1");

// Hàm tạo khóa ECC
function generateECCKeys() {
    const keyPair = ec.genKeyPair();
    return {
        publicKey: keyPair.getPublic("hex"),
        privateKey: keyPair.getPrivate("hex"),
    };
}

// Hàm mã hóa ECC
function eccEncrypt(message, publicKey) {
    const key = ec.keyFromPublic(publicKey, "hex");
    const encrypted = message
        .split("")
        .map((char) => key.getPublic().mul(char.charCodeAt(0)));
    return encrypted.map((point) => ({
        x: point.getX().toString(16),
        y: point.getY().toString(16),
    }));
}

// Hàm giải mã ECC
function eccDecrypt(cipher, privateKey) {
    const key = ec.keyFromPrivate(privateKey, "hex");
    const decrypted = cipher
        .map((point) =>
            String.fromCharCode(
                key.derive(ec.curve.point(point.x, point.y)).toString(10)
            )
        )
        .join("");
    return decrypted;
}
