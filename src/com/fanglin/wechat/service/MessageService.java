package com.fanglin.wechat.service;

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
import com.fanglin.dingding.utils.WXApi;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.HttpUtil;

@Service("messageDDService")
@Transactional(readOnly = true)
public class MessageService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private SystemConfigDao systemConfigDao;

	public int sendMessage(int type, String name, String orderId, float money, String comment) {

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		String url = String.format(WXApi.WXAPI_SEND_MESSAGE_PAYMENT_STR, isv.getValue());

		List<BasicNameValuePair> param = new ArrayList<BasicNameValuePair>();

		param.add(new BasicNameValuePair("payment.type", String.valueOf(type)));
		param.add(new BasicNameValuePair("payment.no", orderId));
		param.add(new BasicNameValuePair("payment.name", name));
		param.add(new BasicNameValuePair("payment.money", String.valueOf(money)));
		param.add(new BasicNameValuePair("payment.comment", comment));

		JSONObject json = HttpUtil.httpPost(url, param);

		if (json == null || json.getInteger("errorCode") == null || json.getInteger("errorCode") != 0) {
			System.out.println(url);
			System.out.println(json);
		}

		return 0;
	}

	public int sendMessage(String unionId, String name, String orderId, String content) {

		this.sendMessage(unionId, name, orderId, content, null);

		return 0;
	}

	public int sendMessage(String unionId, String name, String orderId, String content, String path) {

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		String url = String.format(WXApi.WXAPI_SEND_MESSAGE_SERVICE_SCHEDULE_STR, isv.getValue());

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
			System.out.println(url);
			System.out.println(json);
		}

		return 0;
	}

	public static void main(String[] args) {

		String url = String.format(WXApi.WXAPI_SEND_MESSAGE_SERVICE_SCHEDULE_STR, "http://localhost/");

		List<BasicNameValuePair> param = new ArrayList<BasicNameValuePair>();

		param.add(new BasicNameValuePair("serviceSchedule.unionId", "osRq-w2JGDFtndDf9jwFkDbndMT41"));
		param.add(new BasicNameValuePair("serviceSchedule.name", "test"));
		param.add(new BasicNameValuePair("serviceSchedule.orderId", "1601010001"));
		param.add(new BasicNameValuePair("serviceSchedule.content", "测试"));
		param.add(new BasicNameValuePair("serviceSchedule.time", new SimpleDateFormat("yyyy-MM-dd").format(new Date())));

		param.add(new BasicNameValuePair("serviceSchedule.miniprogram", "pages/drawLine/drawLine?orderId=1601010001"));

		JSONObject json = HttpUtil.httpPost(url, param);

		if (json == null || json.getInteger("errorCode") == null || json.getInteger("errorCode") != 0) {
			System.out.println(url);
			System.out.println(json);
		}
	}
}
