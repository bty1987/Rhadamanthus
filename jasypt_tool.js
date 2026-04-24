/**
 * Jasypt-spring-boot 兼容的 AES-256 加密工具
 * 算法：PBEWithHMACSHA512AndAES_256
 *
 * 参数：
 * - KDF: PBKDF2-HMAC-SHA512
 * - 迭代次数: 100000
 * - Key长度: 32字节
 * - IV长度: 16字节 (随机)
 * - Salt长度: 16字节
 * - 填充: PKCS7 (Node.js 自动处理)
 * - 输出格式: Base64(salt[16] + iv[16] + ciphertext)
 *
 * 用法:
 *   node jasypt_tool.js <password> <content> [--decrypt]
 */

const crypto = require('crypto');

const ITERATIONS = 100000;
const SALT_SIZE = 16;
const IV_SIZE = 16;
const KEY_SIZE = 32;

function deriveKey(password, salt) {
    // 使用 PBKDF2-HMAC-SHA512 派生密钥
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_SIZE, 'sha512');
}

function encrypt(password, plaintext) {
    // 生成随机 salt 和 iv
    const salt = crypto.randomBytes(SALT_SIZE);
    const iv = crypto.randomBytes(IV_SIZE);

    // 派生密钥
    const key = deriveKey(password, salt);

    // AES-256-CBC 加密（Node.js 自动 PKCS7 填充）
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let ciphertext = cipher.update(plaintext, 'utf8');
    ciphertext = Buffer.concat([ciphertext, cipher.final()]);

    // 输出格式: salt + iv + ciphertext
    const combined = Buffer.concat([salt, iv, ciphertext]);

    // Base64 编码
    return combined.toString('base64');
}

function decrypt(password, ciphertextB64) {
    // Base64 解码
    const raw = Buffer.from(ciphertextB64, 'base64');

    // 提取 salt, iv, ciphertext
    const salt = raw.slice(0, SALT_SIZE);
    const iv = raw.slice(SALT_SIZE, SALT_SIZE + IV_SIZE);
    const ciphertext = raw.slice(SALT_SIZE + IV_SIZE);

    // 派生密钥
    const key = deriveKey(password, salt);

    // AES-256-CBC 解密（Node.js 自动 PKCS7 去除填充）
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let plaintext = decipher.update(ciphertext);
    plaintext = Buffer.concat([plaintext, decipher.final()]);

    return plaintext.toString('utf8');
}

// 命令行处理
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('用法: node jasypt_tool.js <password> <content> [--decrypt]');
    console.log('');
    console.log('示例:');
    console.log('  加密: node jasypt_tool.js "myPassword" "mySecret"');
    console.log('  解密: node jasypt_tool.js "myPassword" "encryptedString" --decrypt');
    process.exit(1);
}

const password = args[0];
const content = args[1];
const shouldDecrypt = args.includes('--decrypt');

if (shouldDecrypt) {
    try {
        const decrypted = decrypt(password, content);
        console.log('Encrypted: ' + content);
        console.log('Decrypted: ' + decrypted);
    } catch (error) {
        console.error('解密失败: ' + error.message);
        process.exit(1);
    }
} else {
    try {
        const encrypted = encrypt(password, content);
        console.log('Original:  ' + content);
        console.log('Encrypted: ' + encrypted);

        // 验证
        const decrypted = decrypt(password, encrypted);
        console.log('Decrypted: ' + decrypted);
        console.log('');

        if (content === decrypted) {
            console.log('✓ 加密解密验证成功! (Jasypt兼容)');
        } else {
            console.log('✗ 验证失败! 原文与解密结果不匹配');
        }
    } catch (error) {
        console.error('加密失败: ' + error.message);
        process.exit(1);
    }
}
