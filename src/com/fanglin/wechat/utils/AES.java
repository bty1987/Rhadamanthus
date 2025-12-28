/**
 * @File Name		: AES.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2017-5-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.utils;

import java.security.Key;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @File Name		: AES.java
 * @Package   	: com.fanglin.wechat.utils
 * @Version		: 1.0
 * @Date			: 2017-5-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信小程序 AES 解密工具
 */

/**
 * AES 解密工具（用于微信小程序数据解密）
 *
 * 使用 AES/CBC/PKCS5Padding 模式
 * 注意：PKCS5Padding 和 PKCS7Padding 在 AES 块大小为 16 字节时是等效的
 */
public class AES {

	private static final Logger logger = LoggerFactory.getLogger(AES.class);

    /**
     * AES 解密
     *
     * @param content 密文（Base64 解码后的字节数组）
     * @param keyByte 密钥（Base64 解码后的字节数组）
     * @param ivByte 初始化向量（Base64 解码后的字节数组）
     * @return 解密后的明文
     */
    public byte[] decrypt(byte[] content, byte[] keyByte, byte[] ivByte) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            Key sKeySpec = new SecretKeySpec(keyByte, "AES");
            IvParameterSpec ivParameterSpec = new IvParameterSpec(ivByte);
            cipher.init(Cipher.DECRYPT_MODE, sKeySpec, ivParameterSpec);
            byte[] result = cipher.doFinal(content);
            return result;
        } catch (Exception e) {
            logger.error("AES解密失败", e);
        }
        return null;
    }

}