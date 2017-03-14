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

import java.security.MessageDigest;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.fanglin.core.interceptor.FLException;

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
	}
	
	public static String encrypt(String content, String key) throws Exception{
		
		byte[] input = content.getBytes("UTF-8");  
        
        MessageDigest md = MessageDigest.getInstance("MD5");  
        byte[] thedigest = md.digest(key.getBytes("UTF-8"));  
        SecretKeySpec skc = new SecretKeySpec(thedigest, "AES");  
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");  
        cipher.init(Cipher.ENCRYPT_MODE, skc);  
          
        byte[] cipherText = new byte[cipher.getOutputSize(input.length)];  
        int ctLength = cipher.update(input, 0, input.length, cipherText, 0);  
        ctLength += cipher.doFinal(cipherText, ctLength);  
              
        return parseByte2HexStr(cipherText);  
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

		try {
			SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");  
			secureRandom.setSeed(strKey.getBytes()); 

			keygen = KeyGenerator.getInstance("AES");
			keygen.init(128, secureRandom);

			desKey = keygen.generateKey();
			c = Cipher.getInstance("AES");

			c.init(Cipher.DECRYPT_MODE, desKey);

			cByte = c.doFinal(parseHexStr2Byte(src));
			
			return new String(cByte, "UTF-8");
		} catch (Exception e) {
			new FLException(110005, "登陆超时");
		}
		
		return "";
	}
	
	public static String decrypt(String encrypted, String seed) throws Exception {  
        byte[] keyb = seed.getBytes("UTF-8");  
        MessageDigest md = MessageDigest.getInstance("MD5");  
        byte[] thedigest = md.digest(keyb);  
        SecretKeySpec skey = new SecretKeySpec(thedigest, "AES");  
        Cipher dcipher = Cipher.getInstance("AES");  
        dcipher.init(Cipher.DECRYPT_MODE, skey);  
  
        byte[] clearbyte = dcipher.doFinal(toByte(encrypted));  
        return new String(clearbyte);  
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
	
	private static byte[] toByte(String hexString) {  
        int len = hexString.length() / 2;  
        byte[] result = new byte[len];  
        for (int i = 0; i < len; i++) {  
            result[i] = Integer.valueOf(hexString.substring(2 * i, 2 * i + 2), 16).byteValue();  
        }  
        return result;  
    }  
	
	public static void main(String[] args) throws Exception {
		
		System.out.println(encryptToString("fanglinGNFNG32!", "fanglin")); // 192.168.1.4
		
		System.out.println(encryptToString("fanglin5PFNG32!", "fanglin")); // 192.168.5.10
		
		System.out.println(encryptToString("fanglin1LCJS72!", "fanglin")); // 192.168.5.11
//		System.out.println(encryptToString("mysql1LCJS72!", "fanglin"));
		
		System.out.println(encryptToString("fanglin1L8GS72!", "fanglin")); // 192.168.5.12
//		System.out.println(encryptToString("mysql1L8GS72!", "fanglin"));
		
		System.out.println(encryptToString("fanglinG2DNG32!", "fanglin")); // 192.168.5.13
//		System.out.println(encryptToString("mysqlG2DNG32!", "fanglin"));
		
		System.out.println(encryptToString("fanglin8BCNG32!", "fanglin")); // 192.168.5.14
//		System.out.println(encryptToString("mysql8BCNG32!", "fanglin"));
		
		System.out.println(encryptToString("fanglinDQFNG32!", "fanglin")); // 192.168.5.15
//		System.out.println(encryptToString("mysqlDQFNG32!", "fanglin"));
		
//		System.out.println(encryptToString("FanglinH7C9772!", "fanglin")); // 61.161.149.154:3001
		
//		System.out.println(encryptToString("FanglinDCVG772!", "fanglin")); // 61.161.149.154:3003
		
		System.out.println();
		
		String str = "12345" + 3;
		String key = "FanglinServer";
		String encrytStr;
		// byte[] encrytByte;

		// byte[] byteRe = enCrypt(str,key);

		// 加密过的二进制数组转化成16进制的字符串
		encrytStr = parseByte2HexStr(encryptTobyte(str, key));
		System.out.println("加密后：" + encrytStr);

		// 加密过的16进制的字符串转化成二进制数组
		// encrytByte = parseHexStr2Byte(encrytStr);
		System.out.println("解密后：" + decryptByte(parseHexStr2Byte(encrytStr), key));
		
		System.out.println("加密后：" + encryptToString("userId=FL-00479,roleId=R_50,userName=白添宇,updateTime=1481262867035,company=0,timeout=1,rollcall=0", "FanglinTest"));
		System.out.println("解密后：" + decryptString("F04218BED2B227860CBFBDA49F1136998950DA40D5698253A92A302530F6ADD33E0E05637C15E1B643A11C99489EAB43AE080943F1FBD3B54C53B101F2440386995522550596CB3F6EBA4FA60C786F8185A2084EDFFE54B5B421F50F4AC21BA7C91D9C9148BF49D8C326344DDAA84AD8", "fanglinserver"));
		
		System.out.println(encrypt("{\"userId\":\"U001\",\"userName\":\"测试\",\"timeout\":1}", "test"));
		System.out.println(decrypt("C2F854020B3CEC2B7F2F7B7BB7DD640510FA225DEC4CC06817C3806D9A80AEE654B78DE91BDE9510C0299EC634628D8BE6CA93D9829576A935FB4A6E3ABDF238", "test"));
		
	}

}
