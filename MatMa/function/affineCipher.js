function affineEncryptAuto(plainText) {
    const a = [3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25][Math.floor(Math.random() * 11)]; // Chọn `a` ngẫu nhiên sao cho gcd(a, 26) = 1
    const b = Math.floor(Math.random() * 26); // Sinh `b` ngẫu nhiên
    const cipherText = plainText
        .toUpperCase()
        .split("")
        .map((char) => {
            if (char.match(/[A-Z]/)) {
                const x = char.charCodeAt(0) - 65;
                return String.fromCharCode(((a * x + b) % 26) + 65);
            }
            return char;
        })
        .join("");

    return {
        cipherText: cipherText,
        key: { a, b },
    };
}

function affineDecrypt(cipherText, key) {
    const { a, b } = key;
    const m = 26;
    const aInverse = [...Array(m).keys()].find((i) => (a * i) % m === 1); // Tìm nghịch đảo của `a`
    const plainText = cipherText
        .toUpperCase()
        .split("")
        .map((char) => {
            if (char.match(/[A-Z]/)) {
                const y = char.charCodeAt(0) - 65;
                return String.fromCharCode(((aInverse * (y - b + m)) % m) + 65);
            }
            return char;
        })
        .join("");

    return plainText;
}
