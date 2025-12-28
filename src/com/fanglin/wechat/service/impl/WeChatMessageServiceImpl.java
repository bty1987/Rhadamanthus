/**
 * @File Name		: WeChatMessageServiceImpl.java
 * @Package   	: com.fanglin.wechat.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信消息服务实现类
 */

package com.fanglin.wechat.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.HttpUtil;
import com.fanglin.wechat.service.WeChatMessageService;
import com.fanglin.wechat.utils.WeChatApi;

/**
 * 微信消息服务实现
 * 用于发送微信模板消息（支付通知、服务进度通知等）
 */
@Service("weChatMessageService")
@Transactional(readOnly = true)
public class WeChatMessageServiceImpl implements WeChatMessageService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public int sendPaymentMessage(int type, String name, String orderId, float money, String comment) {

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		String url = String.format(WeChatApi.WXAPI_SEND_MESSAGE_PAYMENT_STR, isv.getValue());

		List<BasicNameValuePair> param = new ArrayList<BasicNameValuePair>();

		param.add(new BasicNameValuePair("payment.type", String.valueOf(type)));
		param.add(new BasicNameValuePair("payment.no", orderId));
		param.add(new BasicNameValuePair("payment.name", name));
		param.add(new BasicNameValuePair("payment.money", String.valueOf(money)));
		param.add(new BasicNameValuePair("payment.comment", comment));

		JSONObject json = HttpUtil.httpPost(url, param);

		if (json == null || json.getInteger("errorCode") == null || json.getInteger("errorCode") != 0) {
			logger.error("发送支付通知失败: url={}, response={}", url, json);
		}

		return 0;
	}

	@Override
	public int sendServiceSchedule(String unionId, String name, String orderId, String content) {

		return sendServiceSchedule(unionId, name, orderId, content, null);
	}

	@Override
	public int sendServiceSchedule(String unionId, String name, String orderId, String content, String path) {

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		String url = String.format(WeChatApi.WXAPI_SEND_MESSAGE_SERVICE_SCHEDULE_STR, isv.getValue());

		List<BasicNameValuePair> param = new ArrayList<BasicNameValuePair>();

		param.add(new BasicNameValuePair("serviceSchedule.unionId", unionId));
		param.add(new BasicNameValuePair("serviceSchedule.name", name));
		param.add(new BasicNameValuePair("serviceSchedule.orderId", orderId));
		param.add(new BasicNameValuePair("serviceSchedule.content", content));
		param.add(new BasicNameValuePair("serviceSchedule.time", new SimpleDateFormat("yyyy-MM-dd").format(new Date())));

		if (path != null && !"".equals(path) && path.startsWith("http")) {
			param.add(new BasicNameValuePair("serviceSchedule.url", path));
		} else if (path != null && !"".equals(path)) {
			param.add(new BasicNameValuePair("serviceSchedule.miniprogram", path));
		}

		JSONObject json = HttpUtil.httpPost(url, param);

		if (json == null || json.getInteger("errorCode") == null || json.getInteger("errorCode") != 0) {
			logger.error("发送服务进度通知失败: url={}, response={}", url, json);
		}

		return 0;
	}

}
