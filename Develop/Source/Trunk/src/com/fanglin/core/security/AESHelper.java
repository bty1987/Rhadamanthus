/*
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

import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class AESHelper {
	
	/**
	 * 加密函数
	 * 
	 * @param content  加密的内容
	 * @param strKey 密钥
	 * @return 返回二进制字符数组
	 * @throws Exception
	 */
	public static byte[] encryptTobyte(String content, String strKey) throws Exception {
		KeyGenerator keygen;
		SecretKey desKey;
		Cipher c;
		byte[] cByte;
		String str = content;

		SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");  
	    secureRandom.setSeed(strKey.getBytes()); 

		keygen = KeyGenerator.getInstance("AES");
		keygen.init(128, secureRandom);

		desKey = keygen.generateKey();
		c = Cipher.getInstance("AES");

		c.init(Cipher.ENCRYPT_MODE, desKey);

		cByte = c.doFinal(str.getBytes("UTF-8"));

		return cByte;
	}

	/**
	 * 加密函数
	 * 
	 * @param content  加密的内容
	 * @param strKey 密钥
	 * @return 返回加密的串
	 * @throws Exception
	 */
	public static String encryptToString(String content, String strKey) throws Exception {
		KeyGenerator keygen;
		SecretKey desKey;
		Cipher c;
		byte[] cByte;
		String str = content;

		SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");  
	    secureRandom.setSeed(strKey.getBytes()); 

		keygen = KeyGenerator.getInstance("AES");
		keygen.init(128, secureRandom);

		desKey = keygen.generateKey();
		c = Cipher.getInstance("AES");

		c.init(Cipher.ENCRYPT_MODE, desKey);

		cByte = c.doFinal(str.getBytes("UTF-8"));

		return parseByte2HexStr(cByte);
		//return content;
	}
	
	/**
	 * 解密函数
	 * 
	 * @param src 加密过的二进制字符数组
	 * @param strKey 密钥
	 * @return 返回解密后的串
	 * @throws Exception
	 */
	public static String decryptByte(byte[] src, String strKey) throws Exception {
		KeyGenerator keygen;
		SecretKey desKey;
		Cipher c;
		byte[] cByte;

		SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");  
	    secureRandom.setSeed(strKey.getBytes()); 

		keygen = KeyGenerator.getInstance("AES");
		keygen.init(128, secureRandom);

		desKey = keygen.generateKey();
		c = Cipher.getInstance("AES");

		c.init(Cipher.DECRYPT_MODE, desKey);

		cByte = c.doFinal(src);

		return new String(cByte, "UTF-8");
	}

	/**
	 * 解密函数
	 * 
	 * @param src 加密过的字符串
	 * @param strKey 密钥
	 * @return 解密后的串
	 * @throws Exception
	 */
	public static String decryptString(String src, String strKey) throws Exception {
		
		KeyGenerator keygen;
		SecretKey desKey;
		Cipher c;
		byte[] cByte;

		SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");  
	    secureRandom.setSeed(strKey.getBytes()); 

		keygen = KeyGenerator.getInstance("AES");
		keygen.init(128, secureRandom);

		desKey = keygen.generateKey();
		c = Cipher.getInstance("AES");

		c.init(Cipher.DECRYPT_MODE, desKey);

		cByte = c.doFinal(parseHexStr2Byte(src));

		
		return new String(cByte, "UTF-8");
	}

	/**
	 * 2进制转化成16进制
	 * 
	 * @param buf 要转换的2进制串
	 * @return 16进制串
	 */
	public static String parseByte2HexStr(byte buf[]){
		StringBuffer sb = new StringBuffer();
		for(int i = 0; i < buf.length; i++){
			String hex = Integer.toHexString(buf[i] & 0xFF);
			if(hex.length() == 1){
				hex = '0' + hex;
			}
			sb.append(hex.toUpperCase());
		}
		return sb.toString();
	}

	/**
	 * 将16进制转换为二进制
	 * 
	 * @param hexStr
	 * @return
	 */
	public static byte[] parseHexStr2Byte(String hexStr){
		if(hexStr.length() < 1)
			return null;
		byte[] result = new byte[hexStr.length() / 2];
		for(int i = 0; i < hexStr.length() / 2; i++){
			int high = Integer.parseInt(hexStr.substring(i * 2, i * 2 + 1), 16);
			int low = Integer.parseInt(hexStr.substring(i * 2 + 1, i * 2 + 2), 16);
			result[i] = (byte) (high * 16 + low);
		}
		return result;
	}
	
	public static void main(String[] args) throws Exception {
		String str = "12345" + 3;
		String key = "userId";
		String encrytStr;
		// byte[] encrytByte;

		// byte[] byteRe = enCrypt(str,key);

		// 加密过的二进制数组转化成16进制的字符串
		encrytStr = parseByte2HexStr(encryptTobyte(str, key));
		System.out.println("加密后：" + encrytStr);

		// 加密过的16进制的字符串转化成二进制数组
		// encrytByte = parseHexStr2Byte(encrytStr);
		System.out.println("解密后：" + decryptByte(parseHexStr2Byte(encrytStr), key));
		
		System.out.println("加密后：" + encryptToString(str, key));
		System.out.println("解密后：" + decryptString("44D13F0453FE3742A22844FD0B8F1B3ACEBC6C7A11205A4147DD1D2976DC35C710A3C46A3F474576FAA5CDEC85D853ACBA42795FB3ACD51E9C57B40DAFB4484BBA1BA0CA9ABCDE791647EABF354F1919B88B1C6B4614ADE25DA29FB75D3BD58B", "123456"));
	}

}
