function shiftCipherEncryptAuto(plainText) {
    const shiftKey = Math.floor(Math.random() * 26); // Tự sinh khóa trong khoảng [0, 25]
    const cipherText = plainText
        .split("")
        .map((char) => {
            if (char.match(/[a-z]/i)) {
                const base = char.charCodeAt(0) >= 97 ? 97 : 65;
                return String.fromCharCode(((char.charCodeAt(0) - base + shiftKey) % 26) + base);
            }
            return char;
        })
        .join("");

    return {
        cipherText: cipherText,
        key: shiftKey,
    };
}

function shiftCipherDecrypt(cipherText, shiftKey) {
    const plainText = cipherText
        .split("")
        .map((char) => {
            if (char.match(/[a-z]/i)) {
                const base = char.charCodeAt(0) >= 97 ? 97 : 65;
                return String.fromCharCode(((char.charCodeAt(0) - base - shiftKey + 26) % 26) + base);
            }
            return char;
        })
        .join("");

    return plainText;
}
