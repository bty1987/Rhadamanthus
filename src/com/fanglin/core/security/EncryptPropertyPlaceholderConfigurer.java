package com.fanglin.core.security;

import java.util.Properties;

import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;

/**
 * Spring XML 属性解密配置器
 * 
 * 用法：替换 ApplicationContext.xml 中的 PropertyPlaceholderConfigurer
 * 自动识别 ENC(...) 格式的加密值并解密，明文值直接使用
 */
public class EncryptPropertyPlaceholderConfigurer extends PropertyPlaceholderConfigurer {

    private static final String ENC_PREFIX = "ENC(";
    private static final String ENC_SUFFIX = ")";

    @Override
    protected String resolvePlaceholder(String placeholder, Properties props, int systemPropertiesMode) {
        String value = super.resolvePlaceholder(placeholder, props, systemPropertiesMode);
        return decryptIfNeeded(value, placeholder);
    }

    /**
     * 如果是加密值则解密，否则直接返回明文
     */
    private String decryptIfNeeded(String value, String placeholder) {
        if (value == null || value.isEmpty()) {
            return value;
        }

        // 已加密: ENC(xxx)
        if (value.startsWith(ENC_PREFIX) && value.endsWith(ENC_SUFFIX)) {
            String encrypted = value.substring(ENC_PREFIX.length(), value.length() - ENC_SUFFIX.length());
            try {
                return AESHelper.decrypt(
                    encrypted,
                    KeyManager.getCurrentKey(),
                    KeyManager.getCurrentIv()
                );
            } catch (Exception e) {
                throw new RuntimeException("解密配置失败: " + placeholder + ", " + e.getMessage(), e);
            }
        }

        // 明文：直接返回（兜底）
        return value;
    }
}
