package com.fanglin.yspay.utils;

import java.io.ByteArrayOutputStream;

public class ByteUtil {

	private static String hexStr = "0123456789ABCDEF";

	private static final char[] BToA = "0123456789abcdef".toCharArray();

	private static final String N_LINE = "----------------------------------------------------------------------------";

	/**
	 * 
	 * @param iSource
	 * @param iArrayLen
	 * @return
	 */
	public static byte[] int2ByteArray(int iSource, int iArrayLen) {
		byte[] bLocalArr = new byte[iArrayLen];
		for (int i = iArrayLen; (i < 4) && (i > 0); i--) {
			bLocalArr[i - 1] = (byte) (iSource >> 8 * (iArrayLen - i) & 0xFF);
		}
		return bLocalArr;
	}

	public static String trace(byte[] inBytes) {
		int i, j = 0;
		byte[] temp = new byte[76];
		bytesSet(temp, ' ');
		StringBuffer strc = new StringBuffer("");
		strc.append(N_LINE + "\n");
		for (i = 0; i < inBytes.length; i++) {
			if (j == 0) {
				System.arraycopy(String.format("%03d: ", i).getBytes(), 0, temp, 0, 5);
				System.arraycopy(String.format(":%03d", i + 15).getBytes(), 0, temp, 72, 4);
			}
			System.arraycopy(String.format("%02X ", inBytes[i]).getBytes(), 0, temp, j * 3 + 5 + (j > 7 ? 1 : 0), 3);
			if (inBytes[i] == 0x00) {
				temp[j + 55 + ((j > 7 ? 1 : 0))] = '.';
			} else {
				temp[j + 55 + ((j > 7 ? 1 : 0))] = inBytes[i];
			}
			j++;
			if (j == 16) {
				strc.append(new String(temp)).append("\n");
				bytesSet(temp, ' ');
				j = 0;
			}
		}
		if (j != 0) {
			strc.append(new String(temp)).append("\n");
			bytesSet(temp, ' ');
		}
		strc.append(N_LINE + "\n");
		return strc.toString();
	}

	/**
	 * byte数组赋值
	 * 
	 * @param inBytes
	 * @param fill
	 * @return
	 * @throws Exception
	 */
	private static void bytesSet(byte[] inBytes, char fill) {
		if (inBytes.length == 0) {
			return;
		}
		for (int i = 0; i < inBytes.length; i++) {
			inBytes[i] = (byte) fill;
		}
	}

	/**
	 * 合并byte[]数组
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static byte[] byteAndByte(byte[] begin, byte[] second) {

		if (begin == null || begin.length == 0) {

			if (second != null && second.length != 0) {

				return second;

			} else {

				return null;
			}

		} else if (second == null || second.length == 0) {

			return begin;
		}

		byte[] newTotal = new byte[begin.length + second.length];

		for (int i = 0; i < begin.length; i++) {

			newTotal[i] = begin[i];
		}

		for (int i = begin.length; i < second.length + begin.length; i++) {

			newTotal[i] = second[i - begin.length];
		}

		return newTotal;
	}

	/**
	 * 截取新byte数组
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public static byte[] getsubByte(byte[] total, int begin, int length) {

		if (length > 0) {
			byte[] newTotal = new byte[length];

			for (int i = begin; i < length + begin; i++) {

				newTotal[i - begin] = total[i];

			}
			return newTotal;
		}
		return new byte[0];
	}

	/**
	 * ����ַ�
	 * 
	 * @param string
	 *            ���ǰ���ַ�
	 * @param filler
	 *            ��Ҫ�����ַ�
	 * @param totalLength
	 *            ������ܳ���
	 * @param atEnd
	 *            trueΪ��ԭ�ַ���ұ����,falseΪ��ԭ�ַ���������
	 * @return String
	 */
	public static String fillString(String string, char filler, int totalLength, boolean atEnd) {

		byte[] tempbyte = string.getBytes();
		int currentLength = tempbyte.length;
		int delta = totalLength - currentLength;

		for (int i = 0; i < delta; i++) {
			if (atEnd) {
				string += filler;
			} else {
				string = filler + string;
			}
		}

		return string;
	}

	/**
	 * Convert hex string to byte[]
	 * 
	 * @param hexString
	 *            the hex string
	 * @return byte[]s
	 */
	public static byte[] hexStringToBytes(String hexString) {
		if (hexString == null || hexString.equals("")) {
			return null;
		}
		hexString = hexString.toUpperCase();
		int length = hexString.length() / 2;
		char[] hexChars = hexString.toCharArray();
		byte[] d = new byte[length];
		for (int i = 0; i < length; i++) {
			int pos = i * 2;
			d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]) & 0xff);
		}
		return d;
	}

	/**
	 * Convert char to byte
	 * 
	 * @param c
	 *            char
	 * @return byte
	 */
	public static byte charToByte(char c) {
		return (byte) "0123456789ABCDEF".indexOf(c);
	}

	public static String bytesToHexString(byte[] src) {

		StringBuilder stringBuilder = new StringBuilder("");
		if (src == null || src.length <= 0) {
			return null;
		}
		for (int i = 0; i < src.length; i++) {
			int v = src[i] & 0xFF;
			String hv = Integer.toHexString(v);
			if (hv.length() < 2) {
				stringBuilder.append(0);
			}
			stringBuilder.append(hv);
		}
		return stringBuilder.toString().toUpperCase();

	}

	public static String bytesToString(byte[] src, int begin, int length) {

		String str1 = null;
		StringBuilder sb = new StringBuilder("");
		if (begin == 0 && length == 0) {
			for (byte element : src) {
				sb.append(String.valueOf(element));
			}
		} else {
			for (int i = begin; i < begin + length; i++) {
				byte element = src[i];
				sb.append(String.valueOf(element));
			}
		}

		str1 = sb.toString();
		return str1;

	}

	/**
	 * 
	 * @param bytes
	 * @return 将二进制转换为十六进制字符输出
	 */
	public static String binaryToHexString(byte[] bytes) {

		String result = "";
		String hex = "";
		for (int i = 0; i < bytes.length; i++) {
			// 字节高4位
			hex = String.valueOf(hexStr.charAt((bytes[i] & 0xF0) >> 4));
			// 字节低4位
			hex += String.valueOf(hexStr.charAt(bytes[i] & 0x0F));
			result += hex;
		}
		return result.toUpperCase();
	}

	/**
	 * 二进制
	 */
	private static final int DECIMAL = 2;

	/*
	 * 二进制数转换到十进制数
	 */
	public static String binaryToDecimal(String binary) {
		StringBuffer buf = new StringBuffer();
		String[] strBinary = binary.split(" ");// 根据空格拆分二进制数
		for (String str : strBinary) {// 提取二进制数
			StringBuffer strBuf = new StringBuffer(str);
			char[] element = strBuf.reverse().toString().toCharArray();// 反转二进制数方便运算
			int digit = 0;// 次幕
			int result = 0;// 结果
			for (char temp : element) {// 提取单个数
				int intNumber = Integer.parseInt(Character.toString(temp));
				intNumber = intNumber * (int) (Math.pow(DECIMAL, digit));// 根据位数算结果
				// 算法：位数*2的次幕
				result = result + intNumber;
				digit = digit + 1;// 次幕加一
			}
			buf.append(result);
			buf.append(" ");
		}
		return buf.toString();
	}

	/**
	 * 转化十六进制编码为字符串 没有设置编码格式
	 */
	public static String toStringHex(String s) {
		byte[] baKeyword = new byte[s.length() / 2];
		for (int i = 0; i < baKeyword.length; i++) {
			try {
				baKeyword[i] = (byte) (0xff & Integer.parseInt(s.substring(i * 2, i * 2 + 2), 16));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		try {
			s = new String(baKeyword, "utf-8");// UTF-16le:Not
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return s;
	}

	/**
	 * 转化十六进制编码为字符串 设置编码格式
	 */
	public static String toStringHex(String s, String charset) {
		byte[] baKeyword = new byte[s.length() / 2];
		for (int i = 0; i < baKeyword.length; i++) {
			try {
				baKeyword[i] = (byte) (0xff & Integer.parseInt(s.substring(i * 2, i * 2 + 2), 16));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		try {
			s = new String(baKeyword, charset);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return s;
	}

	/**
	 * @函数功能: BCD码转为10进制串(阿拉伯数据)
	 * @输入参数: BCD码
	 * @输入参数: format 补码方式 ： true : 前补零 ; false : 后补零
	 * @输入参数: length 原长度
	 * @输出结果: 10进制串
	 * 
	 */
	public static String cbcd2string(byte[] bytes, boolean format, int length) {
		StringBuffer temp = new StringBuffer(bytes.length * 2);

		for (int i = 0; i < bytes.length; i++) {
			temp.append((byte) ((bytes[i] & 0xf0) >>> 4));
			temp.append((byte) (bytes[i] & 0x0f));
		}

		String val = temp.toString();
		// 左去零
		if (format) {
			if (val.length() > length) {
				return val.substring(0, 1).equalsIgnoreCase("0") ? val.substring(1) : val;
			} else {
				return val;
			}
		}
		// 右去零
		else {
			if (val.length() > length) {
				return val.substring(val.length() - 1, val.length()).equalsIgnoreCase("0") ? val.substring(0, val.length() - 1) : val;
			} else {
				return val;
			}
		}

	}

	/**
	 * @函数功能: 10进制串转为BCD码
	 * @输入参数: 10进制串
	 * @输入参数: format 补码方式 ： true : 前补零 ; false : 后补零
	 * @输出结果: BCD码
	 * 
	 */
	public static byte[] str2cbcd(String asc, boolean format) {
		int len = asc.length();
		int mod = len % 2;

		if (mod != 0) {

			if (format) {
				asc = "0" + asc;
				len = asc.length();
			} else {
				asc = asc + "0";
				len = asc.length();
			}
		}

		byte abt[] = new byte[len];
		if (len >= 2) {
			len = len / 2;
		}

		byte bbt[] = new byte[len];
		abt = asc.getBytes();
		int j, k;

		for (int p = 0; p < asc.length() / 2; p++) {
			if ((abt[2 * p] >= '0') && (abt[2 * p] <= '9')) {
				j = abt[2 * p] - '0';
			} else if ((abt[2 * p] >= 'a') && (abt[2 * p] <= 'z')) {
				j = abt[2 * p] - 'a' + 0x0a;
			} else {
				j = abt[2 * p] - 'A' + 0x0a;
			}

			if ((abt[2 * p + 1] >= '0') && (abt[2 * p + 1] <= '9')) {
				k = abt[2 * p + 1] - '0';
			} else if ((abt[2 * p + 1] >= 'a') && (abt[2 * p + 1] <= 'z')) {
				k = abt[2 * p + 1] - 'a' + 0x0a;
			} else {
				k = abt[2 * p + 1] - 'A' + 0x0a;
			}

			int a = (j << 4) + k;
			byte b = (byte) a;
			bbt[p] = b;
		}
		return bbt;
	}

	/**
	 * @函数功能: 16进制串转为BCD码
	 * @输入参数: 16进制串
	 * @输入参数: format 补码方式 ： true : 前补零 ; false : 后补零
	 * @输出结果: BCD码
	 */
	public static byte[] str2Bcd(String s, boolean format) {
		if (s.length() % 2 != 0) {
			if (format) {
				s = "0" + s;

			} else {
				s = s + "0";
			}
		}
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		char[] cs = s.toCharArray();
		for (int i = 0; i < cs.length; i += 2) {
			int high = cs[i] - '0';
			if (high > 9) {
				high = high - ('A' - '9' - 1);
			}
			int low = cs[i + 1] - '0';
			if (low > 9) {
				low = low - ('A' - '9' - 1);
			}

			baos.write(high << 4 | low);
		}
		return baos.toByteArray();
	}

	/**
	 * @函数功能: BCD码转为十六进制串
	 * @输入参数: BCD码
	 * @输入参数: format 补码方式 ： true : 前补零 ; false : 后补零
	 * @输入参数: length 原长度
	 * @输出结果: 10进制串
	 */
	public static String bcd2Str(byte[] b, boolean format, int length) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < b.length; i++) {

			int h = ((b[i] & 0xff) >> 4) + '0';
			if (h > '9') {
				h = h + ('A' - '9' - 1);
			}
			sb.append((char) h);
			int l = (b[i] & 0x0f) + '0';

			if (l > '9') {
				l = l + ('A' - '9' - 1);
			}
			sb.append((char) l);
		}

		String val = sb.toString().toUpperCase();
		// 左去零
		if (format) {
			if (val.length() > length) {
				return val.substring(0, 1).equalsIgnoreCase("0") ? val.substring(1) : val;
			} else {
				return val;
			}
		}
		// 右去零
		else {
			if (val.length() > length) {
				return val.substring(val.length() - 1, val.length()).equalsIgnoreCase("0") ? val.substring(0, val.length() - 1) : val;
			} else {
				return val;
			}
		}
	}

	/**
	 * @函数功能: BCD码转ASC码
	 * @输入参数: BCD串
	 * @输出结果: ASC码
	 */
	public static String bcd2ASC(byte[] bytes) {
		StringBuffer temp = new StringBuffer(bytes.length * 2);

		for (int i = 0; i < bytes.length; i++) {
			int h = ((bytes[i] & 0xf0) >>> 4);
			int l = (bytes[i] & 0x0f);
			temp.append(BToA[h]).append(BToA[l]);
		}
		return temp.toString().toUpperCase();
	}

	// 转化字符串为十六进制编码
	public static String toHexString(String s) {
		String str = "";
		for (int i = 0; i < s.length(); i++) {
			int ch = s.charAt(i);
			String s4 = Integer.toHexString(ch);
			str = str + s4;
		}
		return str;
	}

	public static byte[] byteTobyte(byte[] data, int index, int lenth) {
		byte[] b = new byte[lenth];
		for (int i = index; i < index + lenth; i++) {
			b[i - index] = data[i];
		}
		return b;
	}

	public static byte[] replenishByteTo8(byte[] b) {
		int i = b.length;
		int x = i % 8;
		if (x != 0) {
			x = 8 - x;
			String replenish = "";
			for (int j = 0; j < x; j++) {
				replenish += "FF";
			}
			return byteAndByte(b, hexStringToBytes(replenish));
		} else {
			return b;
		}
	}

	public static byte[] replenishByteTo16(byte[] b) {
		int i = b.length;
		int x = i % 16;
		if (x != 0) {
			x = 16 - x;
			String replenish = "";
			for (int j = 0; j < x; j++) {
				replenish += "FF";
			}
			return byteAndByte(b, hexStringToBytes(replenish));
		} else {
			return b;
		}
	}

}
