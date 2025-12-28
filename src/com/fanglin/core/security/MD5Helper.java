/*
 * @File Name	: MD5Helper.java
 * @Package		：com.fanglin.commons.security 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: MD5相关的加密Helper
 */

package com.fanglin.core.security;

import java.security.MessageDigest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MD5Helper {

	private static final Logger logger = LoggerFactory.getLogger(MD5Helper.class);

	/**
	 * MD5加密函数
	 * 
	 * @param s
	 *            加密的内容
	 * @return 返回加密的串
	 * @throws Exception
	 */
	public static String MD5(String s) {
		char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };

		try {
			byte[] btInput = s.getBytes();

			MessageDigest mdInst = MessageDigest.getInstance("MD5"); // 获得MD5摘要算法的
																		// MessageDigest
																		// 对象
			mdInst.update(btInput); // 使用指定的字节更新摘要

			byte[] md = mdInst.digest();// 获得密文
			int j = md.length; // 把密文转换成十六进制的字符串形式
			char str[] = new char[j * 2];
			int k = 0;

			for (int i = 0; i < j; i++) {
				byte byte0 = md[i];
				str[k++] = hexDigits[byte0 >>> 4 & 0xf];
				str[k++] = hexDigits[byte0 & 0xf];
			}

			return new String(str);
		} catch (Exception e) {
			logger.error("MD5加密失败", e);
			return null;
		}
	}

	public static void main(String[] args) {
		System.out.println(MD5Helper.MD5("fanglin").equals("35FD596186101F2733C1DD2DD6FBFC6C"));
		System.out.println(MD5Helper.MD5("加密"));
	}

}
