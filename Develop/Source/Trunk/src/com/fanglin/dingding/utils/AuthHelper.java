package com.fanglin.dingding.utils;

import java.net.URLDecoder;
import java.security.MessageDigest;
import java.util.Formatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.po.DAccessTokenPO;
import com.fanglin.dingding.po.DJsapiTicketPO;
import com.fanglin.utils.SystemConfig;

public class AuthHelper {
	
	public static final Logger logger = LoggerFactory.getLogger(AuthHelper.class);

	public static String getAccessToken() {
		
		String url = String.format(DDApi.DDAPI_GET_TOKEN_STR, SystemConfig.getString(Constant.MP_HOST_STR));
		
		JSONObject response = HttpHelper.httpGet(url);
		
		DAccessTokenPO dAccessTokenPO = response.getObject("dAccessToken", DAccessTokenPO.class);
		
		return dAccessTokenPO.getAccesstoken();
	}
	
	public static String getJsapiTicket() {
		
		String url = String.format(DDApi.DDAPI_GET_JSAPI_TICKET_STR, SystemConfig.getString(Constant.MP_HOST_STR));
		
		JSONObject response = HttpHelper.httpGet(url);
		
		DJsapiTicketPO dJsapiTicketPO = response.getObject("dJsapiTicket", DJsapiTicketPO.class);
		
		return dJsapiTicketPO.getJsapi();
	}
	
	private static String sign(String ticket, String nonceStr, long timeStamp, String url) {
		
		String signInfo = "";
		String plain = String.format(DDApi.DDAPI_SIGN_STR, ticket, nonceStr, String.valueOf(timeStamp), url);
		
		try {
			MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
			
			sha1.reset();
			sha1.update(plain.getBytes("UTF-8"));
			
			signInfo = bytesToHex(sha1.digest());
		} catch (Exception e) {
			logger.error(e.getMessage());
		} 
		
		return signInfo;
	}
	
	private static String bytesToHex(byte[] hash) {
		Formatter formatter = new Formatter();
        for (byte b : hash){
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
	}
	
	@SuppressWarnings("deprecation")
	public static String getConfig(String urlString, String queryString){
		
		String url;
		String queryStringEncode = null;
		
		if(queryString != null){
			queryStringEncode = URLDecoder.decode(queryString);
			url = urlString + "?" + queryStringEncode;
		}else{
			url = urlString;
		}
		
		System.out.println(url);
		
		String nonceStr = "abcdefg";
		long timeStamp = System.currentTimeMillis() / 1000;
		String signedUrl = url;
		String ticket = null;
		String signature = null;
		
		try {
			ticket = AuthHelper.getJsapiTicket();
			signature = AuthHelper.sign(ticket, nonceStr, timeStamp, signedUrl);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		System.out.println("({signature:'" + signature + "',nonceStr:'" + nonceStr + "',timeStamp:'" + timeStamp + "',corpId:'" + SystemConfig.getString(Constant.CORP_ID_STR) + "'})");
		
		return "({signature:'" + signature + "',nonceStr:'" + nonceStr + "',timeStamp:'" + timeStamp + "',corpId:'" + SystemConfig.getString(Constant.CORP_ID_STR) + "'})";
	}
	
	public static void main(String[] args) {
//		System.out.println(AuthHelper.getAccessToken());
		System.out.println(AuthHelper.getJsapiTicket());
	}
}
