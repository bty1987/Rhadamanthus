package com.fanglin.core.security;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

/**
 * 密钥管理器 — 多级兜底获取密钥
 *
 * 当前密钥优先级（从高到低）:
 *   1. JVM启动参数: -Dfanglin.secret.key=xxx -Dfanglin.secret.iv=xxx
 *   2. 环境变量:    FANGLIN_SECRET_KEY / FANGLIN_SECRET_IV
 *   3. 配置文件:    sysconfig.properties 中 encryptKeyV1 / encryptIvV1
 *   4. 兜底:       使用 sysconfig.properties 中 encryptKey / encryptIv（旧版密钥）
 *
 * 旧版密钥（兼容存量数据解密）:
 *   - 直接读取 sysconfig.properties 中 encryptKey / encryptIv
 */
public class KeyManager {

    // ========== JVM 启动参数名 ==========
    private static final String SYSTEM_PROP_KEY = "fanglin.secret.key";
    private static final String SYSTEM_PROP_IV  = "fanglin.secret.iv";

    // ========== 环境变量名 ==========
    private static final String ENV_VAR_KEY = "FANGLIN_SECRET_KEY";
    private static final String ENV_VAR_IV  = "FANGLIN_SECRET_IV";

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
        throw new FLException(110022, "不支持的密钥版本: " + version);
    }

    /**
     * 按版本号获取 IV
     */
    public static String getIv(String version) {
        if ("V1".equals(version)) {
            return getCurrentIv();
        }
        throw new FLException(110022, "不支持的密钥版本: " + version);
    }

    /**
     * 获取旧版密钥（兼容存量数据解密）
     * 从 sysconfig.properties 读取 encryptKey
     */
    public static String getLegacyKey() {
        try {
            return SystemConfig.getString("encryptKey");
        } catch (Exception e) {
            throw new FLException(110023, "旧版密钥配置缺失: sysconfig.properties 中缺少 encryptKey");
        }
    }

    /**
     * 获取旧版 IV
     * 从 sysconfig.properties 读取 encryptIv
     */
    public static String getLegacyIv() {
        try {
            return SystemConfig.getString("encryptIv");
        } catch (Exception e) {
            throw new FLException(110023, "旧版密钥配置缺失: sysconfig.properties 中缺少 encryptIv");
        }
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

        // 4. 兜底: 使用旧版密钥（encryptKey/encryptIv，已在配置文件中存在）
        if (isEmpty(key)) {
            try {
                key = SystemConfig.getString("encryptKey");
            } catch (Exception e) {
                throw new FLException(110024,
                    "无法获取AES密钥，请在以下任一来源配置: " +
                    "1.JVM参数 -Dfanglin.secret.key  2.环境变量 FANGLIN_SECRET_KEY  3.配置文件 encryptKeyV1 或 encryptKey");
            }
        }
        if (isEmpty(iv)) {
            try {
                iv = SystemConfig.getString("encryptIv");
            } catch (Exception e) {
                throw new FLException(110025,
                    "无法获取AES IV，请在以下任一来源配置: " +
                    "1.JVM参数 -Dfanglin.secret.iv  2.环境变量 FANGLIN_SECRET_IV  3.配置文件 encryptIvV1 或 encryptIv");
            }
        }

        cachedKey = key;
        cachedIv  = iv;
        initialized = true;

        return "key".equals(type) ? cachedKey : cachedIv;
    }

    private static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
