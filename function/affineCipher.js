function affineEncryptAuto(plainText) {
    const a = [3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25][Math.floor(Math.random() * 11)]; // Chọn `a` ngẫu nhiên sao cho gcd(a, 26) = 1
    const b = Math.floor(Math.random() * 26); // Sinh `b` ngẫu nhiên
    const cipherText = plainText
        .toUpperCase() // Chuyển toàn bộ văn bản về chữ hoa
        .split("")
        .map((char) => {
            if (char.match(/[A-Z]/)) { // Chỉ mã hóa chữ cái
                const x = char.charCodeAt(0) - 65; // Chuyển ký tự thành số
                return String.fromCharCode(((a * x + b) % 26) + 65); // Mã hóa
            }
            return char; // Giữ nguyên các ký tự không phải chữ cái
        })
        .join("");

    return {
        cipherText: cipherText,
        key: { a, b }, // Trả về khóa
    };
}

function affineDecrypt(cipherText, key) {
    const { a, b } = key;
    const m = 26;

    // Tìm nghịch đảo của `a` modulo 26
    const aInverse = [...Array(m).keys()].find((i) => (a * i) % m === 1); 

    // Giải mã văn bản
    const plainText = cipherText
        .toUpperCase() // Chuyển toàn bộ văn bản về chữ hoa
        .split("")
        .map((char) => {
            if (char.match(/[A-Z]/)) { // Chỉ giải mã chữ cái
                const y = char.charCodeAt(0) - 65; // Chuyển ký tự thành số
                return String.fromCharCode(((aInverse * (y - b + m)) % m) + 65); // Giải mã
            }
            return char; // Giữ nguyên các ký tự không phải chữ cái
        })
        .join("");

    return plainText; // Trả về văn bản gốc đã giải mã
}

// Test hàm mã hóa và giải mã Affine Cipher
const plainText = "HELLO WORLD"; // Văn bản gốc

// Mã hóa văn bản
const { cipherText, key } = affineEncryptAuto(plainText);
console.log("Văn bản gốc:", plainText);
console.log("Văn bản mã hóa:", cipherText);
console.log("Khóa sử dụng:", key);

// Giải mã văn bản
const decryptedText = affineDecrypt(cipherText, key);
console.log("Văn bản giải mã:", decryptedText);

// Kiểm tra xem kết quả giải mã có trùng với văn bản gốc không
if (decryptedText === plainText) {
    console.log("Giải mã thành công!");
} else {
    console.log("Giải mã thất bại!");
}
