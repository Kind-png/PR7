const crypto = require('node:crypto');

const secretKey = 'secret_key';   // secret
const secretIV = 'initialization_vector';  // share
const encMethod = 'aes-256-cbc';

const key = crypto.createHash('sha512').update(secretKey).digest('hex').substring(0, 32);
const encIv = crypto.createHash('sha512').update(secretIV).digest('hex').substring(0, 16);

function encryptData(data) {
    const cipher = crypto.createCipheriv(encMethod, key, encIv);
    const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    return Buffer.from(encrypted).toString('base64');
}

function decryptData(encryptedData) {
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(encMethod, key, encIv);
    return decipher.update(buff.toString('utf-8'), 'hex', 'utf8') + decipher.final('utf8');
}

const originalText = "Hello, this is a secret message!";
const encryptedText = encryptData(originalText);
console.log("Encrypted:", encryptedText);

const decryptedText = decryptData(encryptedText);
console.log("Decrypted:", decryptedText);
