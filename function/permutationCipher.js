// Hàm tạo khóa hoán vị ngẫu nhiên
function generateRandomPermutation(size) {
    const key = Array.from({ length: size }, (_, i) => i);
    for (let i = size - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [key[i], key[j]] = [key[j], key[i]]; // Hoán đổi vị trí
    }
    return key;
}

// Hàm mã hóa với khóa hoán vị ngẫu nhiên
function permutationEncryptAuto(plainText) {
    const blockSize = 4; // Đặt kích thước khối (có thể thay đổi)
    const key = generateRandomPermutation(blockSize);

    // Thêm dấu cách vào vị trí thích hợp trước khi mã hóa
    const spacesIndexes = [];
    for (let i = 0; i < plainText.length; i++) {
        if (plainText[i] === " ") {
            spacesIndexes.push(i);
        }
    }

    // Loại bỏ khoảng trắng để mã hóa
    plainText = plainText.replace(/\s/g, "");

    // Padding nếu độ dài không chia hết cho kích thước khối
    while (plainText.length % blockSize !== 0) {
        plainText += "_";
    }

    const cipherText = [];
    for (let i = 0; i < plainText.length; i += blockSize) {
        const block = plainText.slice(i, i + blockSize);
        cipherText.push(key.map((index) => block[index]).join(""));
    }

    // Chèn lại dấu cách vào vị trí ban đầu
    let result = cipherText.join("");
    for (let idx of spacesIndexes) {
        result = result.slice(0, idx) + " " + result.slice(idx);
    }

    return {
        cipherText: result,
        key: key,
    };
}

// Hàm giải mã
function permutationDecrypt(cipherText, key) {
    const blockSize = key.length;
    const inverseKey = key.map((_, i) => key.indexOf(i)); // Tạo khóa nghịch đảo

    // Loại bỏ dấu cách trong cipherText
    const cipherTextWithoutSpaces = cipherText.replace(/\s/g, "");
    const plainText = [];

    for (let i = 0; i < cipherTextWithoutSpaces.length; i += blockSize) {
        const block = cipherTextWithoutSpaces.slice(i, i + blockSize);
        plainText.push(inverseKey.map((index) => block[index]).join(""));
    }

    // Kết hợp lại các khối văn bản
    let result = plainText.join("");

    // Loại bỏ dấu gạch dưới dư thừa ở cuối
    result = result.replace(/_+$/, "");

    return result;
}


// Test hàm mã hóa và giải mã hoán vị với dấu cách
const plainText = "HELLO WORLD"; // Văn bản gốc

// Mã hóa văn bản
const { cipherText, key } = permutationEncryptAuto(plainText);
console.log("Văn bản gốc:", plainText);
console.log("Văn bản mã hóa:", cipherText);
console.log("Khóa sử dụng:", key);

// Giải mã văn bản
const decryptedText = permutationDecrypt(cipherText, key);
console.log("Văn bản giải mã:", decryptedText);

// Kiểm tra xem kết quả giải mã có trùng với văn bản gốc không
if (decryptedText === plainText) {
    console.log("Giải mã thành công!");
} else {
    console.log("Giải mã thất bại!");
}
