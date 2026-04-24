/**
 * Jasypt 风格的 AES-256 加密工具
 * 使用 PBKDF2 密钥派生 + AES-256-CBC 加密
 * 
 * 用法:
 *   node jasypt_encrypt_tool.js <password> <content>
 * 
 * 示例:
 *   node jasypt_encrypt_tool.js "myPassword" "mySecret"
 */

const crypto = require('crypto');

function encryptPassword(password, content) {
    // 使用 PBKDF2 从密码派生密钥 (100,000 次迭代)
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    
    // 生成随机 IV
    const iv = crypto.randomBytes(16);
    
    // 创建 AES 加密器 (CBC 模式)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    // 加密内容
    let encrypted = cipher.update(content, 'utf8', 'binary');
    encrypted += cipher.final('binary');
    
    // 组合: salt + iv + encrypted_data
    const combined = Buffer.concat([salt, iv, Buffer.from(encrypted, 'binary')]);
    
    // Base64 编码
    const encryptedBase64 = combined.toString('base64');
    
    return encryptedBase64;
}

function decryptPassword(password, encryptedBase64) {
    // Base64 解码
    const combined = Buffer.from(encryptedBase64, 'base64');
    
    // 提取 salt (前16字节), iv (接下来的16字节), encrypted_data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 32);
    const encrypted = combined.slice(32);
    
    // 使用相同的 salt 派生密钥
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    
    // 创建 AES 解密器
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    // 解密
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
}

// 命令行参数处理
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('用法: node jasypt_encrypt_tool.js <password> <content>');
    console.log('');
    console.log('示例:');
    console.log('  加密: node jasypt_encrypt_tool.js "myPassword" "mySecret"');
    console.log('  解密: node jasypt_encrypt_tool.js "myPassword" "encryptedString" --decrypt');
    process.exit(1);
}

const password = args[0];
const content = args[1];
const shouldDecrypt = args.includes('--decrypt');

if (shouldDecrypt) {
    // 解密模式
    try {
        const decrypted = decryptPassword(password, content);
        console.log('Encrypted: ' + content);
        console.log('Decrypted: ' + decrypted);
    } catch (error) {
        console.error('解密失败: ' + error.message);
        process.exit(1);
    }
} else {
    // 加密模式
    try {
        const encrypted = encryptPassword(password, content);
        console.log('Original:  ' + content);
        console.log('Encrypted: ' + encrypted);
        
        // 验证加密
        const decrypted = decryptPassword(password, encrypted);
        console.log('Decrypted: ' + decrypted);
        console.log('');
        console.log('✓ 加密解密验证成功!');
    } catch (error) {
        console.error('加密失败: ' + error.message);
        process.exit(1);
    }
}
