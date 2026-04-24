package com.fanglin.core.security;

/**
 * 敏感数据加解密统一入口
 *
 * 功能:
 *   - 加密: 明文 → ENC(V1:base64密文)
 *   - 解密: 三层回退 — 新格式 → 旧格式(纯Base64) → 当作明文
 *   - 防重复加密: 已加密值直接返回
 *   - 空值安全: null/空字符串直接返回
 */
public class SensitiveDataHelper {

    private static final String ENCRYPT_PREFIX = "ENC(";
    private static final String ENCRYPT_SUFFIX = ")";
    private static final String ENCRYPT_VERSION = "V1";

    // ========== 加密 ==========

    /**
     * 加密敏感数据
     *
     * @param plaintext 明文
     * @return ENC(V1:base64密文) 格式，空值直接返回
     * @throws RuntimeException 加密失败时抛出（不静默返回明文）
     */
    public static String encrypt(String plaintext) {
        // 空值安全
        if (plaintext == null || plaintext.trim().isEmpty()) {
            return plaintext;
        }

        plaintext = plaintext.trim();

        // 防重复加密
        if (isEncrypted(plaintext)) {
            return plaintext;
        }

        try {
            String encrypted = AESHelper.encrypt(
                plaintext,
                KeyManager.getCurrentKey(),
                KeyManager.getCurrentIv()
            );
            return ENCRYPT_PREFIX + ENCRYPT_VERSION + ":" + encrypted + ENCRYPT_SUFFIX;
        } catch (Exception e) {
            throw new RuntimeException("加密失败: " + e.getMessage(), e);
        }
    }

    // ========== 解密 ==========

    /**
     * 解密敏感数据（三层回退）
     *
     * 1. 新格式 ENC(V1:xxx) → 用 V1 密钥解密
     * 2. 旧格式（纯 Base64）→ 用旧密钥解密
     * 3. 兜底 → 当作明文直接返回
     *
     * @param ciphertext 密文或明文
     * @return 明文，空值直接返回
     */
    public static String decrypt(String ciphertext) {
        // 空值安全
        if (ciphertext == null || ciphertext.trim().isEmpty()) {
            return ciphertext;
        }

        ciphertext = ciphertext.trim();

        // 第一层: 新格式 ENC(V1:xxx)
        if (isEncrypted(ciphertext)) {
            return decryptNewFormat(ciphertext);
        }

        // 第二层: 旧格式（纯 Base64，尝试旧密钥解密）
        String legacyResult = tryLegacyDecrypt(ciphertext);
        if (legacyResult != null) {
            return legacyResult;
        }

        // 第三层: 当作明文直接返回
        return ciphertext;
    }

    // ========== 判断 ==========

    /**
     * 判断值是否已加密（新格式）
     */
    public static boolean isEncrypted(String value) {
        if (value == null) return false;
        value = value.trim();
        return value.startsWith(ENCRYPT_PREFIX) && value.endsWith(ENCRYPT_SUFFIX);
    }

    // ========== 内部方法 ==========

    /**
     * 解密新格式 ENC(V1:base64密文)
     */
    private static String decryptNewFormat(String value) {
        try {
            // 去掉 ENC( 和 )
            String inner = value.substring(
                ENCRYPT_PREFIX.length(),
                value.length() - ENCRYPT_SUFFIX.length()
            );

            // 分离版本号和密文: "V1:base64data"
            int colonIndex = inner.indexOf(':');
            if (colonIndex < 0) {
                throw new RuntimeException("加密格式错误，缺少版本号分隔符");
            }

            String version = inner.substring(0, colonIndex);
            String encryptedData = inner.substring(colonIndex + 1);

            return AESHelper.decrypt(
                encryptedData,
                KeyManager.getKey(version),
                KeyManager.getIv(version)
            );
        } catch (Exception e) {
            throw new RuntimeException("解密失败: " + e.getMessage(), e);
        }
    }

    /**
     * 尝试用旧密钥解密（兼容存量数据）
     *
     * @return 解密成功返回明文，失败返回 null
     */
    private static String tryLegacyDecrypt(String value) {
        // 快速排除：手机号是11位纯数字，不可能也是合法的 Base64 密文
        if (value.length() < 10) {
            return null;
        }

        // 快速排除：纯数字/常见明文格式直接跳过
        if (value.matches("^\\d{11}$")) {
            return null; // 11位手机号，是明文
        }

        try {
            return AESHelper.decrypt(
                value,
                KeyManager.getLegacyKey(),
                KeyManager.getLegacyIv()
            );
        } catch (Exception e) {
            // 解密失败说明不是旧格式密文，返回 null 让调用方当明文处理
            return null;
        }
    }
}
