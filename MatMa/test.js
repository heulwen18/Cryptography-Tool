import { rsaEncrypt, rsaDecrypt, generateRSAKeys } from './function/rsa.js';

try {
    // Kiểm tra hàm generateRSAKeys
    const { publicKey, privateKey } = generateRSAKeys();
    console.log('Public Key:', publicKey);
    console.log('Private Key:', privateKey);

    // Văn bản cần mã hóa
    const plainText = 'Hello, RSAxxx!';

    // Kiểm tra hàm rsaEncrypt
    const { cipherText, key } = rsaEncrypt(plainText);
    console.log('Cipher Text:', cipherText);
    console.log('Private Key (from encryption):', key);

    // Kiểm tra hàm rsaDecrypt
    const decryptedText = rsaDecrypt(cipherText, key);
    console.log('Decrypted Text:', decryptedText);

    // Kết quả giải mã phải khớp với văn bản gốc
    console.assert(decryptedText === plainText, 'Decrypted text does not match original!');
} catch (error) {
    console.error('Error:', error.message);
}
