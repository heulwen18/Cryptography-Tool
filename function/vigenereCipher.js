function vigenereEncryptAuto(plainText) {
    const keyLength = Math.floor(Math.random() * 10) + 5; // Độ dài khóa từ 5 đến 15
    const key = Array.from({ length: keyLength }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join("");

    let j = 0;
    const cipherText = plainText
        .toUpperCase()
        .split("")
        .map((char) => {
            if (char.match(/[A-Z]/)) {
                const shift = key[j % key.length].charCodeAt(0) - 65;
                j++;
                return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
            }
            return char;
        })
        .join("");

    return {
        cipherText: cipherText,
        key: key,
    };
}

function vigenereDecrypt(cipherText, key) {
    let j = 0;
    const plainText = cipherText
        .toUpperCase()
        .split("")
        .map((char) => {
            if (char.match(/[A-Z]/)) {
                const shift = key[j % key.length].charCodeAt(0) - 65;
                j++;
                return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
            }
            return char;
        })
        .join("");

    return plainText;
}
