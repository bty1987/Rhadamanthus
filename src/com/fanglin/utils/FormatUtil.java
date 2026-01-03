/**
 * @File Name		: FormatUtil.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2015-1-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;

public class FormatUtil {

	public static int offset(int number) {
		int offset = SystemConfig.getInt("offset", 1);
		int increment = SystemConfig.getInt("increment", 1);

		return number * increment + offset;
	}

	public static String fillZero(int number, String format) {
		java.text.DecimalFormat df = new java.text.DecimalFormat(format);
		return df.format(number);
	}

	public static int decodeCompany(String company) {

		try {
			int $length = company.length();
			int $index = Integer.parseInt(company.substring($length - 2, $length - 1));
			int _index = Integer.parseInt(company.substring($length - 1));

			return Integer.parseInt(company.substring($index, $index + _index));
		} catch (NumberFormatException e) {
			return -1;
		}
	}

	public static String encodeCompany(int company) {
		return String.format("%d%d%d%d%d", (int) ((Math.random() * 9 + 1) * 100), company, (int) ((Math.random() * 9 + 1) * 10), 3, String.valueOf(company).length());
	}

	public static boolean checkVode(String verifyCode, String securityCode) {

		try {
			if (!verifyCode.equals(AESHelper.decrypt(securityCode, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")))) {
				return false;
			}
		} catch (Exception e) {
			return false;
		}

		return true;
	}

	public static String encodePhone(String phone) {

		try {
			return AESHelper.encrypt(phone, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));
		} catch (Exception e) {
			System.out.println(String.format("Encode Phone Exception: %s, %s", phone, e.getMessage()));
		}

		return phone;
	}

	public static String decodePhone(String phone) {

		try {
			return AESHelper.decrypt(phone, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));
		} catch (Exception e) {
			System.out.println(String.format("Decode Phone Exception: %s, %s", phone, e.getMessage()));
		}

		return phone;
	}

	public static void main(String[] args) throws FLException {

		System.out.println(fillZero(offset(3), "0000"));
		System.out.println(encodeCompany(15));
		System.out.println(decodeCompany("19833631"));

		System.out.println(AESHelper.encrypt("111", "b4d617b336124c63", "b4d1a58a416957a5"));
		System.out.println(AESHelper.encrypt("fanglincommon", "b4d617b336124c63", "b4d1a58a416957a5"));

		System.out.println(AESHelper.decrypt("TAcmaH4kBDO1Njy/48Bg4Q==", "b4d617b336124c63", "b4d1a58a416957a5"));
		System.out.println(decodeCompany(AESHelper.decrypt("TAcmaH4kBDO1Njy/48Bg4Q==", "b4d617b336124c63", "b4d1a58a416957a5")));

		System.out.println(FormatUtil.decodeCompany(FormatUtil.decodePhone("TAcmaH4kBDO1Njy/48Bg4Q==")));

		System.out.println(FormatUtil.encodePhone(null));
	}
}
