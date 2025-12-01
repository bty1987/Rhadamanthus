/**
 * @File Name		: Base64Util.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2017-10-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

import java.io.IOException;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class Base64Util {

	public static String Base64UtilEncoder(String str) {
		BASE64Encoder encoder = new BASE64Encoder();
		String encode = encoder.encode(str.getBytes());
		return encode;
	}

	public static String Base64UtilDecoder(String str) {

		BASE64Decoder decoder = new BASE64Decoder();
		String decode = null;

		try {
			decode = new String(decoder.decodeBuffer(str));
		} catch (IOException e) {
			// e.printStackTrace();
			decode = null;
		}

		return decode;
	}

	public static void main(String[] args) {

		String str = "baitianyu";
		String en = Base64UtilEncoder(str);
		System.out.println(en);
		System.out.println(Base64UtilDecoder(en));

	}
}
