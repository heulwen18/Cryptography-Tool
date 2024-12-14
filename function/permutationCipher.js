// Hàm tạo khóa hoán vị ngẫu nhiên
function generateRandomPermutation(size) {
    const key = Array.from({ length: size }, (_, i) => i);
    for (let i = size - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [key[i], key[j]] = [key[j], key[i]]; // Hoán đổi vị trí
    }
    return key;
}

// Hàm mã hóa với khóa ngẫu nhiên
function permutationEncryptAuto(plainText) {
    const blockSize = 4; // Đặt kích thước khối (có thể thay đổi)
    const key = generateRandomPermutation(blockSize);

    plainText = plainText.replace(/\s/g, ""); // Loại bỏ khoảng trắng

    // Padding nếu độ dài không chia hết cho kích thước khối
    while (plainText.length % blockSize !== 0) {
        plainText += "X";
    }

    const cipherText = [];
    for (let i = 0; i < plainText.length; i += blockSize) {
        const block = plainText.slice(i, i + blockSize);
        cipherText.push(key.map((index) => block[index]).join(""));
    }

    return {
        cipherText: cipherText.join(""),
        key: key,
    };
}

// Hàm giải mã
function permutationDecrypt(cipherText, key) {
    const blockSize = key.length;
    const inverseKey = key.map((_, i) => key.indexOf(i)); // Tạo khóa nghịch đảo

    const plainText = [];
    for (let i = 0; i < cipherText.length; i += blockSize) {
        const block = cipherText.slice(i, i + blockSize);
        plainText.push(inverseKey.map((index) => block[index]).join(""));
    }

    return plainText.join("");
}
