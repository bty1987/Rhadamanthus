/**
 * @File Name		: aaqw.java
 * @Package   	: com.fanglin.postar.utils
 * @Version		: 1.0
 * @Date			: 2022-4-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.postar.utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class ShaUtil {

	public static String getSHA256(String str) {

		MessageDigest messageDigest;
		String encodestr = "";

		try {
			messageDigest = MessageDigest.getInstance("SHA-256");
			messageDigest.update(str.getBytes(StandardCharsets.UTF_8));
			encodestr = byte2Hex(messageDigest.digest());
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}

		return encodestr;
	}

	private static String byte2Hex(byte[] bytes) {

		StringBuilder stringBuffer = new StringBuilder();
		String temp;

		for (byte aByte : bytes) {

			temp = Integer.toHexString(aByte & 0xFF);

			if (temp.length() == 1) {
				stringBuffer.append("0");
			}

			stringBuffer.append(temp);
		}

		return stringBuffer.toString();
	}
}