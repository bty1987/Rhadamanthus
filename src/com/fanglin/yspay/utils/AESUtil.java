package com.fanglin.yspay.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AESUtil {

	private static Logger logger = LoggerFactory.getLogger(AESUtil.class);

	/**
	 * 加密
	 * 
	 * @param content
	 *            需要加密的内容
	 * @param password
	 *            加密密钥
	 * @return
	 */
	public static byte[] encrypt(byte[] content, byte[] password) {
		try {
			SecretKeySpec key = new SecretKeySpec(password, "AES");
			Cipher cipher = Cipher.getInstance("AES");// 创建密码器
			cipher.init(Cipher.ENCRYPT_MODE, key);// 初始化
			byte[] result = cipher.doFinal(content);
			return result; // 加密
		} catch (Exception e) {
			logger.error("加密数据出错", e);
		}
		return null;
	}

	/**
	 * 解密
	 * 
	 * @param content
	 *            待解密内容
	 * @param password
	 *            解密密钥
	 * @return
	 * @throws Exception
	 */
	public static byte[] decrypt(byte[] content, byte[] password) throws Exception {
		try {
			SecretKeySpec key = new SecretKeySpec(password, "AES");
			Cipher cipher = Cipher.getInstance("AES");// 创建密码器
			cipher.init(Cipher.DECRYPT_MODE, key);// 初始化
			byte[] result = cipher.doFinal(content);
			return result; // 解密
		} catch (Exception e) {
			logger.error("AES解密数据出错", e);
			throw e;
		}
	}

}
