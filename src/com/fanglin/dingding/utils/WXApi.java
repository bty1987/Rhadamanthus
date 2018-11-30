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

public interface WXApi {
	
	public static final String WXAPI_SEND_MESSAGE_PAYMENT_STR = "%s/sendPayment.do?payment.type=%d&payment.no=%s&payment.name=%s&payment.money=%s&payment.comment=%s";
	
	public static final String WXAPI_SEND_MESSAGE_SERVICE_SCHEDULE_STR = "%s/sendServiceSchedule.do";
	
}
