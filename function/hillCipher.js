// Hàm tính GCD (Ước chung lớn nhất)
const gcd = (a, b) => (!b ? a : gcd(b, a % b));

// Hàm tính định thức của ma trận 2x2
function determinant2x2(matrix) {
    const [a, b] = matrix[0];
    const [c, d] = matrix[1];
    return (a * d - b * c) % 26;
}

// Hàm kiểm tra ma trận có khả nghịch hay không
function isInvertible(matrix) {
    const det = determinant2x2(matrix);
    return det !== 0 && gcd((det + 26) % 26, 26) === 1;
}

// Hàm tính nghịch đảo modulo
const modInverse = (a, m) => {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    throw new Error(`Không có nghịch đảo modulo cho ${a} với mod ${m}`);
};

// Hàm tính ma trận nghịch đảo 2x2
function inverseMatrix2x2(matrix) {
    const [a, b] = matrix[0];
    const [c, d] = matrix[1];

    const det = (a * d - b * c) % 26;
    if (gcd(det, 26) !== 1) throw new Error("Ma trận không khả nghịch.");

    const detInverse = modInverse((det + 26) % 26, 26);

    // Tính ma trận phụ hợp và nhân với nghịch đảo định thức
    const adjugate = [
        [d, -b],
        [-c, a],
    ];

    return adjugate.map(row =>
        row.map(value => ((value * detInverse) % 26 + 26) % 26)
    );
}

// Hàm tự sinh ma trận khóa ngẫu nhiên
function generateRandomKeyMatrix() {
    while (true) {
        const matrix = [
            [Math.floor(Math.random() * 26), Math.floor(Math.random() * 26)],
            [Math.floor(Math.random() * 26), Math.floor(Math.random() * 26)],
        ];
        if (isInvertible(matrix)) return matrix;
    }
}

// Hàm mã hóa Hill Cipher
function hillEncryptAuto(plainText) {
    const keyMatrix = generateRandomKeyMatrix(); // Tự động sinh KeyMatrix
    const n = keyMatrix.length;

    plainText = plainText.toUpperCase().replace(/[^A-Z]/g, "");

    let paddingCount = 0;
    while (plainText.length % n !== 0) {
        plainText += "X"; // Thêm padding nếu cần
        paddingCount++;
    }

    const blocks = [];
    for (let i = 0; i < plainText.length; i += n) {
        blocks.push(
            plainText
                .slice(i, i + n)
                .split("")
                .map(char => char.charCodeAt(0) - 65) // Chuyển ký tự thành số (A=0, B=1,...)
        );
    }

    const cipherText = blocks
        .map(block =>
            keyMatrix.map(row =>
                row.reduce((sum, value, col) => sum + value * block[col], 0) % 26
            )
        )
        .flat() // Ghép các khối lại thành một mảng duy nhất
        .map(num => String.fromCharCode(num + 65)) // Chuyển số về ký tự
        .join(""); // Nối thành chuỗi

    return { cipherText, keyMatrix, paddingCount };
}

// Hàm giải mã Hill Cipher
function hillDecrypt(cipherText, keyMatrix, paddingCount = 0) {
    const inverseMatrix = inverseMatrix2x2(keyMatrix);

    const n = keyMatrix.length;
    const blocks = [];
    for (let i = 0; i < cipherText.length; i += n) {
        blocks.push(
            cipherText
                .slice(i, i + n)
                .split("")
                .map(char => char.charCodeAt(0) - 65)
        );
    }

    const plainText = blocks
        .map(block =>
            inverseMatrix.map(row =>
                row.reduce((sum, value, col) => sum + value * block[col], 0) % 26
            )
        )
        .flat()
        .map(num => String.fromCharCode(num + 65))
        .join("");

    return plainText.slice(0, plainText.length - paddingCount);
}
const { cipherText, keyMatrix, paddingCount } = hillEncryptAuto("HELLO");
console.log("Cipher Text:", cipherText);
console.log("Key Matrix:", keyMatrix);

// Giải mã
const plainText = hillDecrypt(cipherText, keyMatrix, paddingCount);
console.log("Decrypted Text:", plainText);
