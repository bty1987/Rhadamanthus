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

import com.fanglin.utils.SystemConfig;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class AESHelper {
	
	/**
	 * 新版加密 , 支持python加解密
	 * 
	 * @param content 加密内容
	 * @param key 密钥
	 * @return 加密串
	 */
	public static String encrypt(String content, String key, String ivparam) throws Exception {
		
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        byte[] raw = key.getBytes("ASCII");
        SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
        IvParameterSpec iv = new IvParameterSpec(ivparam.getBytes()); // 使用CBC模式，需要一个向量iv，可增加加密算法的强度
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
        byte[] encrypted = cipher.doFinal(content.getBytes("utf-8"));
        return new BASE64Encoder().encode(encrypted); // 此处使用BASE64做转码。
    }
	
	/**
	 * 新版解密 , 支持python加解密
	 * @param content
	 * @param key
	 * @return
	 */
    public static String decrypt(String content, String key, String ivparam) throws Exception {
    	
        byte[] raw = key.getBytes("ASCII");
        SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
        
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        IvParameterSpec iv = new IvParameterSpec(ivparam.getBytes());
        cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
        
        byte[] encrypted1 = new BASE64Decoder().decodeBuffer(content);//先用base64解密
        byte[] original = cipher.doFinal(encrypted1);
        
        String originalString = new String(original, "utf-8");
        
        return originalString;
    }
    
    public static void main(String[] args) throws Exception {
    	
    	System.out.println(AESHelper.encrypt("fanglincommon", SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
    	System.out.println(AESHelper.decrypt("eX3o2SZdrpVOV9HC4UYTRA==", SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
    	
    	System.out.println(AESHelper.encrypt("baitianyu", SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
    	System.out.println(AESHelper.decrypt("JFuhbyRQTJA+5ewZUb1p+w==", SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
    	
    	System.out.println(AESHelper.decrypt("zmL/NgmvG3wVuBeKeyozyzKCrctm5y5bZ2Xz2J1vqrUlDt6JQYJFhLrJNFMkYjMJ0QtjC0a7DC/dnd4PvyOYdUyrpiDHLQAZIMmehKxWT9fI2jbJ+KB0o6u8FgbqSVPgGOveYcmWZrBjNOwviovKww==", SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
    	
	}

}
