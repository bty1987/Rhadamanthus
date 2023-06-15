package com.fanglin.postar.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SM4Utils {

	public String secretKey = "";
	public String iv = "";
	public boolean hexString = false;

	public SM4Utils() {
		super();
	}

	public SM4Utils(String secretKey, String iv, boolean hexString) {

		super();

		this.secretKey = secretKey;
		this.iv = iv;
		this.hexString = hexString;
	}

	public String encrypt(String plainText) throws Exception {

		Context ctx = new Context();
		ctx.isPadding = true;
		ctx.mode = SM4.SM4_ENCRYPT;

		byte[] keyBytes;
		byte[] ivBytes;

		if (hexString) {
			keyBytes = hexStringToBytes(secretKey);
			ivBytes = hexStringToBytes(iv);
		} else {
			keyBytes = secretKey.getBytes();
			ivBytes = iv.getBytes();
		}

		SM4 sm4 = new SM4();
		sm4.sm4_setkey_enc(ctx, keyBytes);

		byte[] encrypted = sm4.sm4_crypt_cbc(ctx, ivBytes, plainText.getBytes("UTF-8"));

		return byteToHex(encrypted);
	}

	public String decrypt(String cipherText, String secretKey, String iv, boolean hexString) throws Exception {

		byte[] encrypted = hexToByte(cipherText);
		cipherText = Base64Util.encode(encrypted);

		if (cipherText != null && cipherText.trim().length() > 0) {
			Pattern p = Pattern.compile("\\s*|\t|\r|\n");
			Matcher m = p.matcher(cipherText);
			cipherText = m.replaceAll("");
		}

		Context ctx = new Context();
		ctx.isPadding = true;
		ctx.mode = SM4.SM4_DECRYPT;

		byte[] keyBytes;
		byte[] ivBytes;

		if (hexString) {
			keyBytes = hexStringToBytes(secretKey);
			ivBytes = hexStringToBytes(iv);
		} else {
			keyBytes = secretKey.getBytes();
			ivBytes = iv.getBytes();
		}

		SM4 sm4 = new SM4();
		sm4.sm4_setkey_dec(ctx, keyBytes);

		byte[] decrypted = sm4.sm4_crypt_cbc(ctx, ivBytes, Base64Util.decode(cipherText));

		return new String(decrypted, "UTF-8");
	}

	public byte[] hexStringToBytes(String hexString) {

		if (hexString == null || hexString.equals("")) {
			return null;
		}

		hexString = hexString.toUpperCase();
		int length = hexString.length() / 2;
		char[] hexChars = hexString.toCharArray();
		byte[] d = new byte[length];

		for (int i = 0; i < length; i++) {
			int pos = i * 2;
			d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
		}

		return d;
	}

	public static String byteToHex(byte b[]) {

		if (b == null) {
			throw new IllegalArgumentException("Argument b ( byte array ) is null! ");
		}

		String hs = "";
		String stmp = "";

		for (int n = 0; n < b.length; n++) {
			stmp = Integer.toHexString(b[n] & 0xff);
			if (stmp.length() == 1) {
				hs = hs + "0" + stmp;
			} else {
				hs = hs + stmp;
			}
		}

		return hs.toLowerCase();
	}

	public static byte[] hexToByte(String hex) throws IllegalArgumentException {

		if (hex.length() % 2 != 0) {
			throw new IllegalArgumentException();
		}

		char[] arr = hex.toCharArray();
		byte[] b = new byte[hex.length() / 2];

		for (int i = 0, j = 0, l = hex.length(); i < l; i++, j++) {
			String swap = "" + arr[i++] + arr[i];
			int byteint = Integer.parseInt(swap, 16) & 0xFF;
			b[j] = new Integer(byteint).byteValue();
		}

		return b;
	}

	public byte charToByte(char c) {
		return (byte) "0123456789ABCDEF".indexOf(c);
	}

}
