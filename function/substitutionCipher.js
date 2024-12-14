function substitutionEncryptAuto(plainText) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const shuffled = alphabet.split("").sort(() => Math.random() - 0.5).join(""); // Sinh khóa ngẫu nhiên
    const cipherText = plainText
        .toUpperCase()
        .split("")
        .map((char) => (alphabet.includes(char) ? shuffled[alphabet.indexOf(char)] : char))
        .join("");

    return {
        cipherText: cipherText,
        key: shuffled,
    };
}

function substitutionDecrypt(cipherText, key) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const plainText = cipherText
        .toUpperCase()
        .split("")
        .map((char) => (key.includes(char) ? alphabet[key.indexOf(char)] : char))
        .join("");

    return plainText;
}
