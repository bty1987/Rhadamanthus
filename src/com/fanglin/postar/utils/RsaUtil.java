/**
 * @File Name		: RsaUtil.java
 * @Package   	: com.fanglin.postar.utils
 * @Version		: 1.0
 * @Date			: 2022-4-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.postar.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.apache.commons.lang.ArrayUtils;

import Decoder.BASE64Decoder;

public class RsaUtil {

	public static String encrypt(String publicKey, String plainText) {

		try {
			Cipher cipher = Cipher.getInstance("RSA");
			cipher.init(Cipher.ENCRYPT_MODE, getPublicKey(publicKey));

			byte[] bytes = plainText.getBytes();
			ByteArrayInputStream read = new ByteArrayInputStream(bytes);
			ByteArrayOutputStream write = new ByteArrayOutputStream();

			byte[] buf = new byte[117];
			int len = 0;
			while ((len = read.read(buf)) != -1) {
				byte[] buf1 = null;
				if (buf.length == len) {
					buf1 = buf;
				} else {
					buf1 = new byte[len];
					for (int i = 0; i < len; i++) {
						buf1[i] = buf[i];
					}
				}
				byte[] bytes1 = cipher.doFinal(buf1);
				write.write(bytes1);
			}
			return Base64Util.encode(write.toByteArray());
		} catch (InvalidKeyException e) {
			e.printStackTrace();
		} catch (IllegalBlockSizeException e) {
			e.printStackTrace();
		} catch (BadPaddingException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static String decrypt(String key, String data) throws Exception {

		if (key == null) {
			throw new Exception("解密公钥为空, 请设置");
		}

		PublicKey publicKey = getPublicKey(key);
		byte[] cipherData = Base64Util.decode(data);
		Cipher cipher = null;

		try {
			cipher = Cipher.getInstance("RSA");
			cipher.init(Cipher.DECRYPT_MODE, publicKey);
			byte[] buf = (byte[]) null;
			for (int i = 0; i < cipherData.length; i += 256) {
				byte[] doFinal = cipher.doFinal(ArrayUtils.subarray(cipherData, i, i + 256));
				if (buf == null) {
					buf = doFinal;
				} else {
					buf = addBytes(buf, doFinal);
				}
			}

			return new String(buf);
		} catch (NoSuchAlgorithmException e) {
			throw new Exception("无此解密算法");
		} catch (NoSuchPaddingException e) {
			e.printStackTrace();
			return null;
		} catch (InvalidKeyException e) {
			throw new Exception("解密公钥非法,请检查");
		} catch (IllegalBlockSizeException e) {
			throw new Exception("密文长度非法");
		} catch (BadPaddingException e) {
			throw new Exception("密文数据已损坏");
		}

	}

	public static byte[] addBytes(byte[] data1, byte[] data2) {

		byte[] data3 = new byte[data1.length + data2.length];

		System.arraycopy(data1, 0, data3, 0, data1.length);

		System.arraycopy(data2, 0, data3, data1.length, data2.length);

		return data3;
	}

	public static PublicKey getPublicKey(String key) throws Exception {

		byte[] keyBytes;

		keyBytes = new BASE64Decoder().decodeBuffer(key);

		X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);

		KeyFactory keyFactory = KeyFactory.getInstance("RSA");

		PublicKey publicKey = keyFactory.generatePublic(keySpec);

		return publicKey;
	}

}
