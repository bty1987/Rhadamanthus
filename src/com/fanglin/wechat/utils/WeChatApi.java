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

package com.fanglin.wechat.utils;

public interface WeChatApi {

	public static final String WXAPI_SEND_MESSAGE_PAYMENT_STR = "%s/sendPayment.do?payment.type=%d&payment.no=%s&payment.name=%s&payment.money=%s&payment.comment=%s";

	public static final String WXAPI_SEND_MESSAGE_SERVICE_SCHEDULE_STR = "%s/sendServiceSchedule.do";

	public static final String WXAPI_GET_TOKEN_STR = "%s/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s";

	public static final String WXAPI_GET_JSAPI_TICKET_STR = "%s/cgi-bin/ticket/getticket?type=jsapi&access_token=%s";

    public static final String WXAPI_GET_ACCESS_TOKEN_STR = "%s/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code";

    public static final String WXAPI_SIGN_STR = "jsapi_ticket=%s&noncestr=%s&timestamp=%s&url=%s";

    public static final String WXAPI_GET_USER_INFO_STR = "%s/cgi-bin/user/info?access_token=%s&openid=%s&lang=zh_CN";

    public static final String WXAPI_PAYMENT_URL_STR = "%s/%sServlet";

    public static final String WXAPI_PAYMENT_UNIFIEDORDER_STR = "%spay/unifiedorder";

    public static final String WXAPI_PAYMENT_TRANSFERS_STR = "%smmpaymkttransfers/promotion/transfers";

    public static final String WXAPI_MESSAGE_TEMPLATE_SEND_STR = "%s/cgi-bin/message/template/send?access_token=%s"; // 公众号模版路径
    // public static final String WXAPI_MESSAGE_TEMPLATE_SEND_STR = "%s/cgi-bin/message/wxopen/template/uniform_send?access_token=%s";

    public static final String WXAPI_SHORT_URL_STR = "%s/cgi-bin/shorturl?access_token=%s";

    public static final String WAAPI_GET_SESSION_STR = "%s/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";

    public static final String WXAPI_GET_PHONE_INFO_STR = "%s/wxa/business/getuserphonenumber?access_token=%s";
}
