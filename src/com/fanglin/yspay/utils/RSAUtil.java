/**
 * Project Name:payment
 * File Name:SignUtils.java
 * Package Name:cn.swiftpass.utils.payment.sign
 * Date:2014-6-27下午3:22:33
 *
 */

package com.fanglin.yspay.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Encoder;

public class RSAUtil {

	private static Logger logger = LoggerFactory.getLogger(RSAUtil.class);

	private static final String ALGORITHM = "SHA256withRSA";
	private static final String ALGORITHM_1 = "SHA1withRSA"; // 兼容银盛通

	public final static String ALGORITHM_SHA256 = "SHA-256";

	private static final String ALGORITHM_PKCS1PADDING = "RSA/ECB/PKCS1Padding";

	private static final String ALGORITHM_NOPADDING = "RSA/ECB/NoPadding";

	private static final String YST_CERTID = "";

	private final static String YS = "trust"; // 加盐参数

	/**
	 * 签名算法
	 * 
	 * @param data 待签名的数据
	 * @param encoding 编码格式
	 * @return
	 */
	// public static String sign(String data, String encoding, String certId) {
	// logger.info("签名处理开始...");
	// /**
	// * 签名\base64编码
	// */
	// byte[] byteSign = null;
	// String stringSign = null;
	// try {
	// PrivateKey privateKey = CertUtil.getSignCertPrivateKey(certId);
	// if (YST_CERTID.contains(certId)) {
	// byteSign = RSAUtil.base64Encode(RSAUtil.signBySoft1(privateKey, data.getBytes(encoding)));
	// } else {
	// byteSign = RSAUtil.base64Encode(RSAUtil.signBySoft(privateKey, data.getBytes(encoding)));
	// }
	//
	// stringSign = new String(byteSign, encoding);
	// logger.info("报文签名之后的字符串【{}】", stringSign);
	// return stringSign;
	// } catch (Exception e) {
	// logger.error("签名发生异常", e);
	// return null;
	// }
	// }

	/**
	 * 签名算法
	 * 
	 * @param data 待签名的数据
	 * @param encoding 编码格式
	 * @return
	 */
	// public static String sign(String data, String encoding) {
	// logger.info("签名处理开始...");
	// /**
	// * 签名\base64编码
	// */
	// byte[] byteSign = null;
	// String stringSign = null;
	// try {
	// PrivateKey privateKey = CertUtil.getSignCertPrivateKey();
	//
	// byteSign = RSAUtil.base64Encode(RSAUtil.signBySoft(privateKey, data.getBytes(encoding)));
	// stringSign = new String(byteSign, encoding);
	// logger.info("报文签名之后的字符串【{}】", stringSign);
	// return stringSign;
	// } catch (Exception e) {
	// logger.error("签名发生异常", e);
	// return null;
	// }
	// }

	/**
	 * SHA256
	 * 
	 * @param privateKey 私钥
	 * @param data 待签名的数据
	 * @return
	 * @throws Exception
	 */
	public static byte[] signBySoft(PrivateKey privateKey, byte[] data) throws Exception {
		byte[] result = null;
		Signature st = Signature.getInstance(ALGORITHM);
		st.initSign(privateKey);
		st.update(data);
		result = st.sign();
		return result;
	}

	/**
	 * SHA1
	 * 
	 * @param privateKey 私钥
	 * @param data 待签名的数据
	 * @return
	 * @throws Exception
	 */
	public static byte[] signBySoft1(PrivateKey privateKey, byte[] data) throws Exception {
		byte[] result = null;
		Signature st = Signature.getInstance(ALGORITHM_1);
		st.initSign(privateKey);
		st.update(data);
		result = st.sign();
		return result;
	}

	public static boolean validateSign(byte[] signData, byte[] srcData, String certId, String certpath) {
		try {
			if (YST_CERTID.contains(certId)) {
				return RSAUtil.validateSignBySoft1(CertUtil.getValidateCert(certId, certpath).getPublicKey(), signData, srcData);
			}
			return RSAUtil.validateSignBySoft(CertUtil.getValidateCert(certId, certpath).getPublicKey(), signData, srcData);
		} catch (Exception e) {
			logger.error("验证签名发生异常", e);
			return false;
		}
	}

	/**
	 * 签名算法
	 * 
	 * @param data 待签名的数据
	 * @param encoding 编码格式
	 * @return
	 */
	public static String sign(String data, String encoding, String pfxpwd) {
		logger.info("签名处理开始...");
		/**
		 * 签名\base64编码
		 */
		byte[] byteSign = null;
		String stringSign = null;
		try {
			PrivateKey privateKey = CertUtil.getSignCertPrivateKey(pfxpwd);

			byteSign = RSAUtil.base64Encode(RSAUtil.signBySoft(privateKey, data.getBytes(encoding)));
			stringSign = new String(byteSign, encoding);
			logger.info("报文签名之后的字符串【{}】", stringSign);
			return stringSign;
		} catch (Exception e) {
			logger.error("签名发生异常", e);
			return null;
		}
	}

	/**
	 * BASE64解码
	 * 
	 * @param inputByte 待解码数据
	 * @return 解码后的数据
	 * @throws IOException
	 */
	public static byte[] base64Decode(byte[] inputByte) throws IOException {
		return Base64.decodeBase64(inputByte);
	}

	// 公钥加密
	public static byte[] encrypt(byte[] content) throws Exception {

		Cipher cipher = Cipher.getInstance(ALGORITHM_PKCS1PADDING);
		cipher.init(Cipher.ENCRYPT_MODE, CertUtil.getValidateCert().getPublicKey());

		return cipher.doFinal(content);
	}

	public static byte[] encrypt(String certId, String certpath, byte[] content) throws Exception {

		Cipher cipher = Cipher.getInstance(ALGORITHM_PKCS1PADDING);
		cipher.init(Cipher.ENCRYPT_MODE, CertUtil.initValidateCertFromDir(certId, certpath).getPublicKey());

		return cipher.doFinal(content);
	}

	/**
	 * 软验证签名（SHA256）
	 * 
	 * @param publicKey 公钥
	 * @param signData 签名数据
	 * @param srcData 摘要
	 * @param validateMethod 签名方法.
	 * @return
	 * @throws Exception
	 */
	public static boolean validateSignBySoft(PublicKey publicKey, byte[] signData, byte[] srcData) throws Exception {
		Signature st = Signature.getInstance(ALGORITHM);
		st.initVerify(publicKey);
		st.update(srcData);
		return st.verify(signData);
	}

	/**
	 * 软验证签名（SHA1）
	 * 
	 * @param publicKey 公钥
	 * @param signData 签名数据
	 * @param srcData 摘要
	 * @param validateMethod 签名方法.
	 * @return
	 * @throws Exception
	 */
	public static boolean validateSignBySoft1(PublicKey publicKey, byte[] signData, byte[] srcData) throws Exception {
		Signature st = Signature.getInstance(ALGORITHM_1);
		st.initVerify(publicKey);
		st.update(srcData);
		return st.verify(signData);
	}

	// 私钥解密
	public static byte[] decrypt(byte[] content, String paddingType, String certId) throws Exception {
		Cipher cipher = Cipher.getInstance(paddingType);
		cipher.init(Cipher.DECRYPT_MODE, CertUtil.getSignCertPrivateKey(certId));
		return cipher.doFinal(content);
	}

	// 私钥解密
	public static byte[] decrypt2(byte[] content, String certId) throws Exception {
		try {
			return RSAUtil.decrypt(content, ALGORITHM_PKCS1PADDING, certId);
		} catch (Exception e) {
			try {
				return RSAUtil.decrypt(content, ALGORITHM_NOPADDING, certId);
			} catch (Exception e2) {
				logger.error("RSA解密失败", e);
				throw e;
			}

		}
	}

	/**
	 * BASE64编码
	 * 
	 * @param inputByte 待编码数据
	 * @return 解码后的数据
	 * @throws IOException
	 */
	public static byte[] base64Encode(byte[] inputByte) throws IOException {
		return Base64.encodeBase64(inputByte);
	}

	/**
	 * 加密+base64编码
	 * 
	 * @param str
	 * @return 返回编码后的字符串
	 * @throws NoSuchAlgorithmException
	 * @throws UnsupportedEncodingException
	 */
	public static String encoder(String str) throws NoSuchAlgorithmException, UnsupportedEncodingException {
		if (str == null) {
			throw new NullPointerException();
		}
		// 确定计算方法
		BASE64Encoder base64en = new BASE64Encoder();
		// 将密码与加盐串混合再加密，然后base64编码
		String newstr = base64en.encode(sha256(YS + str, "UTF-8"));
		return newstr;
	}

	private static byte[] sha256(byte[] data) {
		MessageDigest md = null;
		try {
			md = MessageDigest.getInstance(ALGORITHM_SHA256);
			md.reset();
			md.update(data);
			return md.digest();
		} catch (Exception e) {
			logger.error("SHA256计算失败", e);
			return null;
		}
	}

	private static byte[] sha256(String datas, String encoding) {
		try {
			return sha256(datas.getBytes(encoding));
		} catch (UnsupportedEncodingException e) {
			logger.error("SHA256计算失败", e);
			return null;
		}
	}

}
