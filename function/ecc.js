const EC = elliptic.ec;
const ec = new EC('secp256k1');

// Tạo cặp khóa ngẫu nhiên
function generateKeyPair() {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    return { publicKey, privateKey };
}

// Hàm băm SHA256
function sha256(message) {
    return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}

// Chuyển thông điệp thành mảng số đại diện
function messageToNumbers(message) {
    let numbers = [];
    for (let i = 0; i < message.length; i++) {
        numbers.push(message.charCodeAt(i)); // Chuyển ký tự thành mã ASCII
    }
    return numbers;
}

// Mã hóa thông điệp
async function encrypt(publicKey, message) {
    const key = ec.keyFromPublic(publicKey, 'hex');
    const msgNumbers = messageToNumbers(message); // Chuyển thông điệp thành mảng số
    const msgHash = sha256(message); // Băm thông điệp
    const hashedMessage = msgHash.slice(0, 64); // Lấy 32 byte đầu tiên của băm

    // Tạo ngẫu nhiên một điểm
    const randomKey = ec.genKeyPair();
    const R = randomKey.getPublic('hex');  // Tạo điểm ngẫu nhiên R

    // Tính toán điểm chia sẻ
    const sharedPoint = randomKey.derive(key.getPublic());
    const sharedHex = sharedPoint.toString(16);

    // Mã hóa C2 bằng XOR giữa thông điệp đã băm và điểm chia sẻ
    let c2 = '';
    for (let i = 0; i < hashedMessage.length; i += 2) {
        const c2Byte = parseInt(hashedMessage.substr(i, 2), 16);
        const sharedByte = parseInt(sharedHex[i % sharedHex.length], 16);
        c2 += (c2Byte ^ sharedByte).toString(16).padStart(2, '0');
    }

    // Trả về kết quả mã hóa C1 và C2
    return { c1: R, c2: c2, numbers: msgNumbers }; // Trả về mảng số đại diện
}

// Giải mã thông điệp
function decrypt(privateKey, c1, c2) {
    const key = ec.keyFromPrivate(privateKey, 'hex');
    const c1Point = ec.keyFromPublic(c1, 'hex'); // Điểm nhận từ bản mã

    // Tính toán điểm chia sẻ
    const sharedPoint = key.derive(c1Point.getPublic());
    const sharedHex = sharedPoint.toString(16);

    // Giải mã C2 bằng cách XOR lại với điểm chia sẻ
    let decryptedMessage = '';
    for (let i = 0; i < c2.length; i += 2) {
        const c2Byte = parseInt(c2.substr(i, 2), 16);
        const sharedByte = parseInt(sharedHex[i % sharedHex.length], 16);
        decryptedMessage += String.fromCharCode(c2Byte ^ sharedByte);
    }

    return decryptedMessage;
}

// Hàm xử lý khi nhấn nút "Tạo khóa"
function handleGenerateKeys() {
    const { publicKey, privateKey } = generateKeyPair();
    document.getElementById('publicKey').innerText = `Public Key: ${publicKey}`;
    document.getElementById('privateKey').innerText = `Private Key: ${privateKey}`;
    document.getElementById('publicKeyInput').value = publicKey;
    document.getElementById('privateKeyInput').value = privateKey;
    document.getElementById('errorMessage').innerText = ''; // Xóa thông báo lỗi
}

// Hàm xử lý khi nhấn nút "Mã hóa"
async function handleEncryption() {
    const publicKey = document.getElementById('publicKeyInput').value;
    const message = document.getElementById('message').value;

    if (!publicKey || !message) {
        throw new Error("Vui lòng nhập đầy đủ Public Key và thông điệp.");
    }

    const startTime = performance.now(); // Thời gian bắt đầu mã hóa
    const { c1, c2, numbers } = await encrypt(publicKey, message);
    const endTime = performance.now(); // Thời gian kết thúc mã hóa

    document.getElementById('ciphertext').innerText = `Ciphertext: C1: ${c1}, C2: ${c2}`;
    document.getElementById('numbers').innerText = `Numbers (Message): ${numbers.join(', ')}`; // In ra mảng số đại diện
    document.getElementById('ciphertextInput').value = `${c1},${c2}`;
    document.getElementById('errorMessage').innerText = ''; // Xóa thông báo lỗi

    // Hiển thị thời gian mã hóa
    const elapsedTime = endTime - startTime;
    document.getElementById('encryptionTime').innerText = `Thời gian mã hóa: ${elapsedTime.toFixed(4)} ms`;
}

// Hàm xử lý khi nhấn nút "Giải mã"
function handleDecryption() {
    const privateKey = document.getElementById('privateKeyInput').value;
    const c1 = document.getElementById('ciphertextInput').value.split(',')[0];
    const c2 = document.getElementById('ciphertextInput').value.split(',')[1];

    if (!privateKey || !c1 || !c2) {
        throw new Error("Vui lòng nhập đầy đủ Private Key và bản mã.");
    }

    const startTime = performance.now(); // Thời gian bắt đầu giải mã
    const decryptedMessage = decrypt(privateKey, c1, c2);
    const endTime = performance.now(); // Thời gian kết thúc giải mã

    document.getElementById('decryptedMessage').innerText = `Decrypted Message: ${decryptedMessage}`;
    document.getElementById('errorMessage').innerText = ''; // Xóa thông báo lỗi

    // Hiển thị thời gian giải mã
    const elapsedTime = endTime - startTime;
    document.getElementById('decryptionTime').innerText = `Thời gian giải mã: ${elapsedTime.toFixed(4)} ms`;
}
