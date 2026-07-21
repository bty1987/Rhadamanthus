/**
 * @File Name		: WecomApi.java
 * @Package   	: com.fanglin.wecom.utils
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信(WeCom)自建应用 API URL 常量
 */

package com.fanglin.wecom.utils;

/**
 * 企业微信自建应用接入所需 API 端点常量
 * <p>
 * 域名占位符 %s 取自 SystemConfig.WECOM_OAPI_URL_STR (默认 https://qyapi.weixin.qq.com)
 * </p>
 */
public interface WecomApi {

	/** 获取应用 access_token: %s=域名, %s=corpid, %s=corpsecret */
	public static final String WECOM_GET_TOKEN_STR = "%s/cgi-bin/gettoken?corpid=%s&corpsecret=%s";

	/** 发送应用消息(text/textcard/markdown 等): %s=域名, %s=access_token */
	public static final String WECOM_MESSAGE_SEND_STR = "%s/cgi-bin/message/send?access_token=%s";

	/** 群机器人 webhook 发送消息: %s=域名, %s=webhook key */
	public static final String WECOM_WEBHOOK_SEND_STR = "%s/cgi-bin/webhook/send?key=%s";

}
