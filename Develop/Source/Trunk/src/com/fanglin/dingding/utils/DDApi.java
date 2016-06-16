/**
 * @File Name		: DDApi.java
 * @Package   	: com.fanglin.dingding.utils
 * @Version		: 1.0
 * @Date			: 2015-11-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.utils;

public interface DDApi {
	
//	public static final String DDAPI_GET_TOKEN_STR = "%s/gettoken?corpid=%s&corpsecret=%s";
	public static final String DDAPI_GET_TOKEN_STR = "%s/queryDAccessTokenForNew.do";
	
//	public static final String DDAPI_GET_JSAPI_TICKET_STR = "%s/get_jsapi_ticket?type=jsapi&access_token=%s";
	public static final String DDAPI_GET_JSAPI_TICKET_STR = "%s/queryDJsapiTicketForNew.do"; 
	
	public static final String DDAPI_SIGN_STR = "jsapi_ticket=%s&noncestr=%s&timestamp=%s&url=%s";
	
	public static final String DDAPI_MESSAGE_SEND_STR = "%s/message/send?access_token=%s";
	
	public static final String DDAPI_GET_USER_INFO_STR = "%s/user/getuserinfo?access_token=%s&code=%s";
	
	public static final String DDAPI_GET_USER_STR = "%s/user/get?access_token=%s&userid=%s";

}
