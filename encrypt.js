const crypto = require('crypto');

function encryptPassword(password, content) {
    // 使用 PBKDF2 从密码派生密钥
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

// 主程序
const password = 'HL1W@c7HCSUaRFSZjpZ@S&%m8dq^bEbQ';
const content = 'Fanglin@Big666';

// 加密
const encrypted = encryptPassword(password, content);
console.log('Original:  ' + content);
console.log('Encrypted: ' + encrypted);

// 解密验证
const decrypted = decryptPassword(password, encrypted);
console.log('Decrypted: ' + decrypted);

if (content === decrypted) {
    console.log('\n✓ 加密解密验证成功!');
} else {
    console.log('\n✗ 加密解密验证失败!');
}
