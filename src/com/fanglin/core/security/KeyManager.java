package com.fanglin.core.security;

import com.fanglin.utils.SystemConfig;

/**
 * 密钥管理器 — 多级兜底获取密钥
 *
 * 优先级（从高到低）:
 *   1. JVM启动参数: -Dfanglin.secret.key=xxx -Dfanglin.secret.iv=xxx
 *   2. 环境变量:    FANGLIN_SECRET_KEY / FANGLIN_SECRET_IV
 *   3. 配置文件:    sysconfig.properties 中 encryptKeyV1 / encryptIvV1
 *   4. 硬编码默认值: 开发环境兜底
 */
public class KeyManager {

    // ========== JVM 启动参数名 ==========
    private static final String SYSTEM_PROP_KEY = "fanglin.secret.key";
    private static final String SYSTEM_PROP_IV  = "fanglin.secret.iv";

    // ========== 环境变量名 ==========
    private static final String ENV_VAR_KEY = "FANGLIN_SECRET_KEY";
    private static final String ENV_VAR_IV  = "FANGLIN_SECRET_IV";

    // ========== 旧密钥（兼容存量数据，不可更改） ==========
    private static final String LEGACY_KEY = "b4d617b336124c63";
    private static final String LEGACY_IV  = "b4d1a58a416957a5";

    // ========== 默认值（开发环境兜底，与旧密钥相同） ==========
    private static final String DEFAULT_KEY = "b4d617b336124c63";
    private static final String DEFAULT_IV  = "b4d1a58a416957a5";

    // ========== 缓存 ==========
    private static String cachedKey = null;
    private static String cachedIv  = null;
    private static boolean initialized = false;

    // ========== 对外接口 ==========

    /**
     * 获取当前 AES 密钥
     */
    public static String getCurrentKey() {
        return getKeyInternal("key");
    }

    /**
     * 获取当前 AES IV
     */
    public static String getCurrentIv() {
        return getKeyInternal("iv");
    }

    /**
     * 按版本号获取密钥（预留多版本密钥支持）
     * 当前仅支持 "V1"
     */
    public static String getKey(String version) {
        if ("V1".equals(version)) {
            return getCurrentKey();
        }
        throw new RuntimeException("不支持的密钥版本: " + version);
    }

    /**
     * 按版本号获取 IV
     */
    public static String getIv(String version) {
        if ("V1".equals(version)) {
            return getCurrentIv();
        }
        throw new RuntimeException("不支持的密钥版本: " + version);
    }

    /**
     * 获取旧版密钥（兼容存量数据解密）
     */
    public static String getLegacyKey() {
        return LEGACY_KEY;
    }

    /**
     * 获取旧版 IV
     */
    public static String getLegacyIv() {
        return LEGACY_IV;
    }

    /**
     * 清空缓存（仅测试用）
     */
    public static void resetCache() {
        cachedKey = null;
        cachedIv  = null;
        initialized = false;
    }

    // ========== 内部实现 ==========

    private static synchronized String getKeyInternal(String type) {
        if (initialized) {
            return "key".equals(type) ? cachedKey : cachedIv;
        }

        // 1. JVM 启动参数
        String key = System.getProperty(SYSTEM_PROP_KEY);
        String iv  = System.getProperty(SYSTEM_PROP_IV);

        // 2. 环境变量
        if (isEmpty(key)) key = System.getenv(ENV_VAR_KEY);
        if (isEmpty(iv))  iv  = System.getenv(ENV_VAR_IV);

        // 3. 配置文件 (encryptKeyV1/encryptIvV1)
        if (isEmpty(key)) {
            try {
                key = SystemConfig.getString("encryptKeyV1");
            } catch (Exception e) {
                // 配置文件中可能没有 encryptKeyV1，忽略
            }
        }
        if (isEmpty(iv)) {
            try {
                iv = SystemConfig.getString("encryptIvV1");
            } catch (Exception e) {
                // 忽略
            }
        }

        // 4. 硬编码默认值（开发环境兜底）
        if (isEmpty(key)) key = DEFAULT_KEY;
        if (isEmpty(iv))  iv  = DEFAULT_IV;

        cachedKey = key;
        cachedIv  = iv;
        initialized = true;

        return "key".equals(type) ? cachedKey : cachedIv;
    }

    private static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
