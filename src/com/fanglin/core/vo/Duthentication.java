/**
 * @File Name	: AuthenticationUtil.java
 * @Package		：com.fanglin.utils
 * @Version		: 1.0
 * @Date		: 2014-7-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: cookie认证相关的操作的工具类
 */

package com.fanglin.core.vo;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import Decoder.BASE64Encoder;

import com.fanglin.core.interceptor.FLException;

public class Duthentication {

	public static final String API_SECRET_STR = "fanglinserver";

	public boolean check(String signature, String timestamp) throws FLException {

		try {
			Mac mac = Mac.getInstance("HmacSHA256");
			SecretKeySpec key = new SecretKeySpec(API_SECRET_STR.getBytes(), "HmacSHA256");
			mac.init(key);
			return signature.equals(new BASE64Encoder().encode(mac.doFinal(timestamp.getBytes())));
		} catch (Exception e) {
			throw new FLException(110005, "登陆超时");
		}
	}

	public static void main(String[] args) throws Exception {

		Mac mac = Mac.getInstance("HmacSHA256");
		SecretKeySpec key = new SecretKeySpec(API_SECRET_STR.getBytes(), "HmacSHA256");
		mac.init(key);
		System.out.println(new BASE64Encoder().encode(mac.doFinal("123".getBytes())));

	}

}
