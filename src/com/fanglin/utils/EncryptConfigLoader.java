package com.fanglin.utils;

import java.io.InputStream;
import java.util.Properties;

import com.fanglin.core.security.AESHelper;
import com.fanglin.core.security.KeyManager;

/**
 * 配置文件加载器（支持加密配置）
 *
 * 功能：
 *   - 加载 properties 文件
 *   - 自动解密 ENC(...) 格式的加密值
 *   - 明文值直接使用（向后兼容）
 *   - 使用 KeyManager 多级兜底获取密钥
 */
public class EncryptConfigLoader {

    private static final String ENC_PREFIX = "ENC(";
    private static final String ENC_SUFFIX = ")";

    /**
     * 加载 properties 文件并自动解密 ENC(...) 值
     * 替代原有的 Properties.load()
     */
    public static Properties load(String configFilePathName) {
        try {
            InputStream is = SystemConfig.class.getResourceAsStream(configFilePathName);
            if (is == null) {
                throw new RuntimeException("配置文件不存在: " + configFilePathName);
            }
            Properties prop = new Properties();
            prop.load(is);
            is.close();

            // 遍历解密
            for (Object keyObj : prop.keySet()) {
                String key = (String) keyObj;
                String value = prop.getProperty(key);
                if (value != null && !value.isEmpty()) {

                    // 已加密: ENC(xxx)
                    if (value.startsWith(ENC_PREFIX) && value.endsWith(ENC_SUFFIX)) {
                        String encrypted = value.substring(ENC_PREFIX.length(), value.length() - ENC_SUFFIX.length());
                        try {
                            prop.setProperty(key, AESHelper.decrypt(
                                encrypted,
                                KeyManager.getCurrentKey(),
                                KeyManager.getCurrentIv()
                            ));
                        } catch (Exception e) {
                            throw new RuntimeException("解密配置失败: " + configFilePathName + ", " + key + ", " + e.getMessage(), e);
                        }
                    }

                    // 明文：直接使用（无需修改）
                }
            }
            return prop;
        } catch (Exception e) {
            throw new RuntimeException("加载配置文件失败: " + configFilePathName + ", " + e.getMessage(), e);
        }
    }
}
