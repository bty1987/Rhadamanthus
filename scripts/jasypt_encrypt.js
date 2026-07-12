/**
 * Jasypt PBEWithHMACSHA512AndAES_256 兼容加密工具
 * 
 * Jasypt 格式：salt(16字节) + 密文
 * PBKDF2: HMAC-SHA512, 1000次迭代, 输出48字节 = 32(key) + 16(iv)
 * AES-256-CBC + PKCS5Padding
 * Base64 编码（不含 ENC() 包装）
 * 
 * 注意：Jasypt 默认不存储 salt 长度前缀，直接是 salt || encrypted
 */
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY_SIZE = 32;     // 256 bits
const IV_SIZE = 16;      // 128 bits
const SALT_SIZE = 16;    // Jasypt default salt size for PBEWithHMACSHA512AndAES_256
const ITERATIONS = 1000;
const HASH_ALGO = 'sha512';

function encrypt(masterPassword, plaintext) {
    const salt = crypto.randomBytes(SALT_SIZE);
    
    // PBKDF2 with HMAC-SHA512, derive key+iv
    const derived = crypto.pbkdf2Sync(masterPassword, salt, ITERATIONS, KEY_SIZE + IV_SIZE, HASH_ALGO);
    const key = derived.subarray(0, KEY_SIZE);
    const iv = derived.subarray(KEY_SIZE, KEY_SIZE + IV_SIZE);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(plaintext, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Jasypt format: salt + encrypted (no length prefix)
    const result = Buffer.concat([salt, encrypted]);
    
    return 'ENC(' + result.toString('base64') + ')';
}

function decrypt(masterPassword, ciphertext) {
    let input = ciphertext;
    if (input.startsWith('ENC(') && input.endsWith(')')) {
        input = input.substring(4, input.length - 1);
    }
    
    const data = Buffer.from(input, 'base64');
    
    // Jasypt format: salt(16) + encrypted
    const salt = data.subarray(0, SALT_SIZE);
    const encrypted = data.subarray(SALT_SIZE);
    
    const derived = crypto.pbkdf2Sync(masterPassword, salt, ITERATIONS, KEY_SIZE + IV_SIZE, HASH_ALGO);
    const key = derived.subarray(0, KEY_SIZE);
    const iv = derived.subarray(KEY_SIZE, KEY_SIZE + IV_SIZE);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
}

// Main
const [,, mode, password, input] = process.argv;

if (!mode || !password || !input) {
    console.log('Usage: node jasypt_encrypt.js <encrypt|decrypt> <master_password> <plaintext>');
    process.exit(1);
}

if (mode === 'encrypt') {
    console.log(encrypt(password, input));
} else if (mode === 'decrypt') {
    console.log(decrypt(password, input));
} else {
    console.error('Unknown mode:', mode);
    process.exit(1);
}
