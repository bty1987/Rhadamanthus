package com.fanglin.seiya.utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class CryptoUtils {

	// --- 修改后的常量 ---
	private static final String ALGORITHM = "AES";
	private static final String TRANSFORMATION = "AES/CBC/PKCS5Padding"; // 使用 CBC 模式
	private static final String HMAC_ALGORITHM = "HmacSHA256"; // HMAC 算法
	private static final int IV_LENGTH = 16; // CBC 模式 IV 长度通常为 16 字节

	private static final ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * 加密对象并生成一个URL安全的令牌
	 * 
	 * @param dataObject 要加密的Java对象
	 * @param secretKey Base64编码的AES密钥
	 * @return URL安全的令牌字符串
	 * @throws Exception 加密过程中的任何异常
	 */
	public static String encryptToToken(Object dataObject, String secretKey) throws Exception {
		try {
			// 1. 序列化对象为JSON字符串
			String jsonString = objectMapper.writeValueAsString(dataObject);

			// 2. 准备密钥
			byte[] keyBytes = Base64.decodeBase64(secretKey.getBytes());
			SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM);

			// 3. 生成随机IV
			byte[] iv = new byte[IV_LENGTH];
			new SecureRandom().nextBytes(iv);
			IvParameterSpec ivSpec = new IvParameterSpec(iv);

			// 4. 初始化Cipher并加密
			Cipher cipher = Cipher.getInstance(TRANSFORMATION);
			cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivSpec);
			byte[] ciphertext = cipher.doFinal(jsonString.getBytes(StandardCharsets.UTF_8));

			// 5. 生成 HMAC (Encrypt-then-MAC)
			// MAC 的计算对象是: IV + Ciphertext
			byte[] ivAndCiphertext = new byte[IV_LENGTH + ciphertext.length];
			System.arraycopy(iv, 0, ivAndCiphertext, 0, IV_LENGTH);
			System.arraycopy(ciphertext, 0, ivAndCiphertext, IV_LENGTH, ciphertext.length);

			Mac mac = Mac.getInstance(HMAC_ALGORITHM);
			SecretKeySpec hmacKey = new SecretKeySpec(keyBytes, HMAC_ALGORITHM); // 使用相同的密钥或派生密钥
			mac.init(hmacKey);
			byte[] hmacBytes = mac.doFinal(ivAndCiphertext);

			// 6. 拼接 IV + Ciphertext + HMAC
			byte[] finalPayload = new byte[ivAndCiphertext.length + hmacBytes.length];
			System.arraycopy(ivAndCiphertext, 0, finalPayload, 0, ivAndCiphertext.length);
			System.arraycopy(hmacBytes, 0, finalPayload, ivAndCiphertext.length, hmacBytes.length);

			// 7. 使用 Base64 URL安全编码生成令牌
			return Base64.encodeBase64URLSafeString(finalPayload);

		} catch (JsonProcessingException e) {
			throw new Exception("JSON序列化失败", e);
		} catch (Exception e) {
			throw new Exception("加密过程失败", e);
		}
	}

	/**
	 * 从令牌解密数据
	 * 
	 * @param token URL安全的令牌字符串
	 * @param secretKey Base64编码的AES密钥
	 * @param targetClass 解密后要转换的目标Java类
	 * @param <T> 泛型类型
	 * @return 解密后的Java对象
	 * @throws Exception 解密过程中的任何异常（包括数据被篡改）
	 */
	public static <T> T decryptFromToken(String token, String secretKey, Class<T> targetClass) throws Exception {
		// 1. Base64 URL安全解码
		byte[] finalPayload = Base64.decodeBase64(token);

		// 2. 分离 IV+Ciphertext 和 HMAC
		if (finalPayload.length < IV_LENGTH + 32) { // HMAC-SHA256 is 32 bytes
			throw new IllegalArgumentException("令牌格式无效，长度不足。");
		}
		int hmacLength = 32;
		byte[] ivAndCiphertext = new byte[finalPayload.length - hmacLength];
		byte[] receivedHmac = new byte[hmacLength];

		System.arraycopy(finalPayload, 0, ivAndCiphertext, 0, ivAndCiphertext.length);
		System.arraycopy(finalPayload, ivAndCiphertext.length, receivedHmac, 0, hmacLength);

		// 3. 准备密钥并验证 HMAC
		byte[] keyBytes = Base64.decodeBase64(secretKey);
		Mac mac = Mac.getInstance(HMAC_ALGORITHM);
		SecretKeySpec hmacKey = new SecretKeySpec(keyBytes, HMAC_ALGORITHM);
		mac.init(hmacKey);
		byte[] calculatedHmac = mac.doFinal(ivAndCiphertext);

		// 比较HMAC，防止时序攻击
		if (!MessageDigest.isEqual(calculatedHmac, receivedHmac)) {
			throw new Exception("解密失败：HMAC验证失败。数据可能已被篡改。");
		}

		// 4. 从 ivAndCiphertext 中分离 IV 和 Ciphertext
		byte[] iv = new byte[IV_LENGTH];
		byte[] ciphertext = new byte[ivAndCiphertext.length - IV_LENGTH];
		System.arraycopy(ivAndCiphertext, 0, iv, 0, IV_LENGTH);
		System.arraycopy(ivAndCiphertext, IV_LENGTH, ciphertext, 0, ciphertext.length);

		// 5. 准备密钥并解密
		SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM);
		IvParameterSpec ivSpec = new IvParameterSpec(iv);
		Cipher cipher = Cipher.getInstance(TRANSFORMATION);
		cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivSpec);
		byte[] decryptedJsonBytes = cipher.doFinal(ciphertext);

		System.out.println(new String(decryptedJsonBytes));

		// 6. 反序列化为Java对象
		String decryptedJson = new String(decryptedJsonBytes, StandardCharsets.UTF_8);

		System.out.println(decryptedJson);

		return objectMapper.readValue(decryptedJson, targetClass);

	}

}