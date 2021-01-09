/**
 * @File Name	: AESHelper.java
 * @Package		：com.fanglin.commons.security 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: AES相关的加密和解密Helper
 */

package com.fanglin.core.security;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import com.fanglin.core.interceptor.FLException;

public class AESHelper {

	/**
	 * 新版加密 , 支持python加解密
	 * 
	 * @param content
	 * @param key
	 * @return 加密串
	 * @throws FLException
	 */
	public static String encrypt(String content, String key, String ivparam) throws FLException {

		try {
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			byte[] raw = key.getBytes("ASCII");
			SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
			IvParameterSpec iv = new IvParameterSpec(ivparam.getBytes()); // 使用CBC模式，需要一个向量iv，可增加加密算法的强度
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
			byte[] encrypted = cipher.doFinal(content.getBytes("utf-8"));
			return new BASE64Encoder().encode(encrypted); // 此处使用BASE64做转码。
		} catch (Exception e) {
			System.out.println(e.getMessage());
			throw new FLException(110005, "系统处理问题");
		}
	}

	/**
	 * 新版解密 , 支持python加解密
	 * 
	 * @param content
	 * @param key
	 * @return
	 * @throws FLException
	 */
	public static String decrypt(String content, String key, String ivparam) throws FLException {

		try {
			byte[] raw = key.getBytes("ASCII");
			SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");

			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			IvParameterSpec iv = new IvParameterSpec(ivparam.getBytes());
			cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

			byte[] encrypted1 = new BASE64Decoder().decodeBuffer(content);// 先用base64解密
			byte[] original = cipher.doFinal(encrypted1);

			return new String(original, "utf-8");
		} catch (Exception e) {
			System.out.println(e.getMessage());
			throw new FLException(110005, "系统处理问题");
		}
	}

	public static void main(String[] args) throws Exception {
		System.out.println(AESHelper.decrypt("tTrLMQT/Z1omMHDuD4v1VQ==", "844dd1be967b6e9e", "cdb421d038104126"));
		System.out.println(AESHelper.encrypt("fanglincommon", "844dd1be967b6e9e", "cdb421d038104126"));
	}

}
