// Hàm tính GCD (Ước chung lớn nhất)
const gcd = (a, b) => (!b ? a : gcd(b, a % b));

// Hàm tính nghịch đảo modulo
const modInverse = (a, m) => {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return -1;
};

// Hàm tính định thức (hỗ trợ ma trận kích thước lớn hơn 2x2)
function calculateDeterminant(matrix) {
    const size = matrix.length;

    if (size === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let determinant = 0;
    for (let col = 0; col < size; col++) {
        const subMatrix = matrix
            .slice(1)
            .map(row => row.filter((_, index) => index !== col));
        const cofactor = matrix[0][col] * calculateDeterminant(subMatrix);
        determinant += (col % 2 === 0 ? 1 : -1) * cofactor;
    }

    return determinant;
}

// Hàm tính ma trận adjugate
function calculateAdjugateMatrix(matrix) {
    const size = matrix.length;
    const adjugate = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => 0)
    );

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const subMatrix = matrix
                .filter((_, row) => row !== i)
                .map((row) => row.filter((_, col) => col !== j));
            const cofactor = calculateDeterminant(subMatrix);
            adjugate[j][i] = ((i + j) % 2 === 0 ? 1 : -1) * cofactor;
        }
    }

    return adjugate;
}

// Hàm kiểm tra ma trận khả nghịch
function isMatrixInvertible(matrix) {
    const determinant = calculateDeterminant(matrix);
    const detModulo26 = (determinant % 26 + 26) % 26;

    return gcd(detModulo26, 26) === 1;
}

// Hàm sinh ma trận ngẫu nhiên
function generateRandomMatrix(size) {
    while (true) {
        const matrix = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => Math.floor(Math.random() * 26))
        );

        const determinant = calculateDeterminant(matrix);
        if (gcd(determinant, 26) === 1 && determinant !== 0) {
            return matrix;
        }
    }
}

// Hàm mã hóa Hill Cipher
function hillEncryptAuto(plainText) {
    const keyMatrix = generateRandomMatrix(2);

    const n = keyMatrix.length;
    plainText = plainText.toUpperCase().replace(/[^A-Z]/g, ""); // Chỉ giữ các chữ cái

    let paddingCount = 0;
    while (plainText.length % n !== 0) {
        plainText += "X"; // Thêm padding nếu cần
        paddingCount++;
    }

    const cipherText = [];
    for (let i = 0; i < plainText.length; i += n) {
        const block = plainText
            .slice(i, i + n)
            .split("")
            .map((char) => char.charCodeAt(0) - 65);

        const encryptedBlock = keyMatrix.map((row) =>
            row.reduce((sum, value, col) => sum + value * block[col], 0) % 26
        );

        cipherText.push(...encryptedBlock.map((num) => String.fromCharCode(num + 65)));
    }

    return {
        cipherText: cipherText.join(""),
        keyMatrix: keyMatrix,
        paddingCount: paddingCount,
    };
}

// Hàm giải mã Hill Cipher
function hillDecrypt(cipherText, keyMatrix, paddingCount = 0) {
    if (!isMatrixInvertible(keyMatrix)) {
        throw new Error("The provided key matrix is not invertible.");
    }

    const n = keyMatrix.length;

    const determinant = calculateDeterminant(keyMatrix);
    const detModulo26 = (determinant % 26 + 26) % 26;
    const detInverse = modInverse(detModulo26, 26);

    const inverseMatrix = calculateAdjugateMatrix(keyMatrix).map((row) =>
        row.map((value) => ((value * detInverse) % 26 + 26) % 26)
    );

    const plainText = [];
    for (let i = 0; i < cipherText.length; i += n) {
        const block = cipherText
            .slice(i, i + n)
            .split("")
            .map((char) => char.charCodeAt(0) - 65);

        const decryptedBlock = inverseMatrix.map((row) =>
            row.reduce((sum, value, col) => sum + value * block[col], 0) % 26
        );

        plainText.push(...decryptedBlock.map((num) => String.fromCharCode(num + 65)));
    }

    return plainText.join("").slice(0, -paddingCount);
}
