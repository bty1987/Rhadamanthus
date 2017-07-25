package com.fanglin.dingding.service;

import java.net.URLDecoder;
import java.security.MessageDigest;
import java.util.Formatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.po.DAccessTokenPO;
import com.fanglin.dingding.po.DJsapiTicketPO;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

@Service("authDDService")
@Transactional(readOnly = true)
public class AuthService {
	
	public static final Logger logger = LoggerFactory.getLogger(AuthService.class);
	
	@Autowired
	private SystemConfigDao systemConfigDao; 
	
	public  String getAccessToken() {
		
		SystemConfigPO mpHost = systemConfigDao.querySystemConfigByKey("mpHost");
		
		SystemConfigPO company = systemConfigDao.querySystemConfigByKey("company");

		String url = String.format(DDApi.DDAPI_GET_TOKEN_STR, mpHost.getValue(),company.getValue());
		

		JSONObject response = HttpHelper.httpGet(url);
		
		DAccessTokenPO dAccessTokenPO = response.getObject("dAccessToken", DAccessTokenPO.class);
		
		return dAccessTokenPO.getAccesstoken();
	}
	
	public   String getJsapiTicket() {
		
		SystemConfigPO mpHost = systemConfigDao.querySystemConfigByKey("mpHost");
		
		SystemConfigPO company = systemConfigDao.querySystemConfigByKey("company");
		
		String url = String.format(DDApi.DDAPI_GET_JSAPI_TICKET_STR, mpHost.getValue(),company.getValue());
		
		JSONObject response = HttpHelper.httpGet(url);
		
		DJsapiTicketPO dJsapiTicketPO = response.getObject("dJsapiTicket", DJsapiTicketPO.class);
		
		return dJsapiTicketPO.getJsapi();
	}
	
	public  String sign(String ticket, String nonceStr, long timeStamp, String url) {
		
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
	
	public String bytesToHex(byte[] hash) {
		Formatter formatter = new Formatter();
        for (byte b : hash){
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
	}
	
	@SuppressWarnings("deprecation")
	public  String getConfig(String urlString, String queryString){
		
		String url;
		String queryStringEncode = null;
		
		if(queryString != null){
			queryStringEncode = URLDecoder.decode(queryString);
			url = urlString + "?" + queryStringEncode;
		}else{
			url = urlString;
		}
		
		String nonceStr = "abcdefg";
		long timeStamp = System.currentTimeMillis() / 1000;
		String signedUrl = url;
		String ticket = null;
		String signature = null;
		
		try {
			ticket = getJsapiTicket();
			signature =sign(ticket, nonceStr, timeStamp, signedUrl);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		
		SystemConfigPO corpId = systemConfigDao.querySystemConfigByKey("corpId");
	
		return "({signature:'" + signature + "',nonceStr:'" + nonceStr + "',timeStamp:'" + timeStamp + "',corpId:'" + corpId.getValue() + "'})";
	}
	
}

