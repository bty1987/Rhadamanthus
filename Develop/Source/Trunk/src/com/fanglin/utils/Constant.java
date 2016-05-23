/*
 * @File Name	: Constant.java
 * @Package		：com.fanglin.utils
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 常量定义的类
 */

package com.fanglin.utils;

public interface Constant {
	
	// cookie 认证相关定义
	String COOKIE_AUTHENTICATION = "authentication";
	int COOKIE_AUTHENTICATION_NUM = 6;
	
	String COOKIE_AUTHENTICATION_USERID = "userId=";
	
	String COOKIE_AUTHENTICATION_ROLEID = "roleId=";
	
	String COOKIE_AUTHENTICATION_USERNAME = "userName=";
	
	String COOKIE_AUTHENTICATION_UPDATETIME = "updateTime=";
	
	String COOKIE_AUTHENTICATION_ISMOBILE = "isMobile=";
	
	String COOKIE_AUTHENTICATION_FLAG = "flag=";
	
	String COOKIE_AUTHENTICATION_SPLIT = ",";
	
	// cookie 验证码定义
	String COOKIE_VERIFYCODE = "verifyCode";
	
	// cookie 地址
	String COOKIE_HOSTSERVER_STR = "hostServer";
	String COOKIE_MEDIASERVER_STR = "mediaServer";
	String COOKIE_COMMUNIONSERVER_STR = "communionServer";
	String COOKIE_DMEDIASERVER_STR = "dmediaServer";
	
	// 系统版本
	String COOKIE_VERSIONCODE_STR = "versionCode";
	
	// cookie 订单编号
	String COOKIE_DECORATIONORDER_ORDERID = "decorationOrderId";
	
	// cookie 报价编号
	String COOKIE_QUOTATIONID = "quotationId";
	
	public static final String COMMA = ",";
	public static final String COLON = ":";
	public static final String SEMICOLON = ";";
	public static final String SLASH = "/";
	
}
