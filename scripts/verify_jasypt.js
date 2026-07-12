// 验证: RandomIvGenerator 模式
// 格式: salt(16) + iv(16) + ciphertext
// PBKDF2 dklen 测试 32 vs 48
const crypto = require('crypto');

const MASTER_KEY = 'HL1W@c7HCSUaRFSZjpZ@S&%m8dq^bEbQ';
const ENC_VALUE = 'pNDPxcG8XMbM2FP2qISsVrPPyMQgfNQ2Z4ls9BrDEa4KbtO+rK/7lOQVFnEZT37aEOPWtGCujAYPtM3d5GRM4WxYLMN9qexLCIUhjP8XhtI=';

const raw = Buffer.from(ENC_VALUE, 'base64');
console.log('Total bytes:', raw.length);

const salt = raw.subarray(0, 16);
const iv = raw.subarray(16, 32);
const ciphertext = raw.subarray(32);

console.log('salt:', salt.length, 'iv:', iv.length, 'ciphertext:', ciphertext.length);

// Test 1: PBKDF2 dklen=32 (only key, IV from data)
console.log('\n--- Test 1: dklen=32, iterations=100000 ---');
try {
    const derived32 = crypto.pbkdf2Sync(MASTER_KEY, salt, 100000, 32, 'sha512');
    const d1 = crypto.createDecipheriv('aes-256-cbc', derived32, iv);
    let r1 = d1.update(ciphertext);
    r1 = Buffer.concat([r1, d1.final()]);
    console.log('Result:', r1.toString('utf-8'));
} catch(e) {
    console.log('Failed:', e.message);
}

// Test 2: PBKDF2 dklen=48 (key+iv from PBKDF2, but IV overridden by data IV)
console.log('\n--- Test 2: dklen=48, iterations=100000 ---');
try {
    const derived48 = crypto.pbkdf2Sync(MASTER_KEY, salt, 100000, 48, 'sha512');
    const key = derived48.subarray(0, 32);
    const d2 = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let r2 = d2.update(ciphertext);
    r2 = Buffer.concat([r2, d2.final()]);
    console.log('Result:', r2.toString('utf-8'));
} catch(e) {
    console.log('Failed:', e.message);
}

// Test 3: iterations=1000, dklen=32
console.log('\n--- Test 3: dklen=32, iterations=1000 ---');
try {
    const derived = crypto.pbkdf2Sync(MASTER_KEY, salt, 1000, 32, 'sha512');
    const d3 = crypto.createDecipheriv('aes-256-cbc', derived, iv);
    let r3 = d3.update(ciphertext);
    r3 = Buffer.concat([r3, d3.final()]);
    console.log('Result:', r3.toString('utf-8'));
} catch(e) {
    console.log('Failed:', e.message);
}

// Test 4: iterations=1000, dklen=48
console.log('\n--- Test 4: dklen=48, iterations=1000 ---');
try {
    const derived = crypto.pbkdf2Sync(MASTER_KEY, salt, 1000, 48, 'sha512');
    const key = derived.subarray(0, 32);
    const d4 = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let r4 = d4.update(ciphertext);
    r4 = Buffer.concat([r4, d4.final()]);
    console.log('Result:', r4.toString('utf-8'));
} catch(e) {
    console.log('Failed:', e.message);
}
