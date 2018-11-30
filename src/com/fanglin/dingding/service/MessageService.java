
package com.fanglin.dingding.service;

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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.po.AppMessageDelivery;
import com.fanglin.dingding.po.MessageDelivery;
import com.fanglin.dingding.po.OAMessage;
import com.fanglin.dingding.po.TextMessage;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.dingding.utils.WXApi;
import com.fanglin.information.po.MessagePO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.HttpUtil;
import com.fanglin.utils.LogUtils;

@Service("messageDDService")
@Transactional(readOnly = true)
public class MessageService {

	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private AuthService authDDService;

	@Autowired
	private SystemConfigDao systemConfigDao;
	
	public short sendMessage(String receiveId, String senderName, String contents, int aimid, int company) throws FLException {

		String accessToken = authDDService.getAccessToken(FormatUtil.encodeCompany(company));

		SystemConfigPO deliverValue = systemConfigDao.querySystemConfig("messageAgentId", company);
		
		SystemConfigPO jumpValue = systemConfigDao.querySystemConfig("messageUrl", company);
		
		if(accessToken == null || deliverValue == null || jumpValue == null){
			return -1;
		}

		AppMessageDelivery appMessageDelivery = new AppMessageDelivery(receiveId, "", deliverValue.getValue());
		
		OAMessage oaMessage = new OAMessage();
		
		oaMessage.message_url = String.format(jumpValue.getValue(), aimid);
		
		OAMessage.Head head = new OAMessage.Head();
		
		head.bgcolor = "FFDFD130";
		oaMessage.head = head;
		OAMessage.Body body = new OAMessage.Body();

		body.content = "内容  : " + contents;
		body.author = "发送人 : " + senderName;

		oaMessage.body = body;

		appMessageDelivery.withMessage(oaMessage);

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		String url = String.format(DDApi.DDAPI_MESSAGE_SEND_STR, oapiHost.getValue(), accessToken);
		
		JSONObject json = HttpHelper.httpPost(url, appMessageDelivery.toJsonObject());
		
		if(json == null){
			throw new FLException(270007, "发送消息失败");
		}else if(json.getInteger("errcode") != 0){
			LogUtils.logging(logger, url, json.getInteger("errcode"),  json.getString("errmsg"));
//			throw new FLException(json.getInteger("errcode"),  json.getString("errmsg"));
		}
		
		return json == null ? MessagePO.MESSAGE_DRESULT_FAIL_STR : json.getShort("errcode");
	}
	
	public int sendMessage(int type, String name, String orderId, float money, String comment){
		
		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
		
		String url = String.format(WXApi.WXAPI_SEND_MESSAGE_PAYMENT_STR, isv.getValue());
		
		List<BasicNameValuePair> param = new ArrayList<BasicNameValuePair>(); 
		
        param.add(new BasicNameValuePair("payment.type", String.valueOf(type)));
        param.add(new BasicNameValuePair("payment.no", orderId));
        param.add(new BasicNameValuePair("payment.name", name));
        param.add(new BasicNameValuePair("payment.money", String.valueOf(money)));
        param.add(new BasicNameValuePair("payment.comment", comment));
		
		JSONObject json = HttpUtil.httpPost(url, param);
		
		if(json == null || json.getInteger("errorCode") == null || json.getInteger("errorCode") != 0){
			System.out.println(url);
			System.out.println(String.format("%d-%s", json.getInteger("errorCode"), json.getString("errorMsg")));
		}
		
		return 0;
	}
	
	public int sendMessage(String unionId, String name, String orderId, String content){
		
		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
		
		String url = String.format(WXApi.WXAPI_SEND_MESSAGE_SERVICE_SCHEDULE_STR, isv.getValue());
		
		List<BasicNameValuePair> param = new ArrayList<BasicNameValuePair>(); 
		
		param.add(new BasicNameValuePair("serviceSchedule.unionId", unionId));
        param.add(new BasicNameValuePair("serviceSchedule.name", name));
        param.add(new BasicNameValuePair("serviceSchedule.orderId", orderId));
        param.add(new BasicNameValuePair("serviceSchedule.content", content));
        param.add(new BasicNameValuePair("serviceSchedule.time", new SimpleDateFormat("yyyy-MM-dd").format(new Date())));
		
		JSONObject json = HttpUtil.httpPost(url, param);
		
		if(json == null || json.getInteger("errorCode") == null || json.getInteger("errorCode") != 0){
			System.out.println(url);
			System.out.println(String.format("%d-%s", json.getInteger("errorCode"), json.getString("errorMsg")));
		}
		
		return 0;
	}
	
	public int sendMessage(String accessToken, String message){
		
		// 返单 https://oapi.dingtalk.com/robot/send?access_token=71449a2f7b476bf25fde8e568253c80d093ea7142e3e3731b926bc545c3ef4c3
		// https://oapi.dingtalk.com//message/send?access_token=71449a2f7b476bf25fde8e568253c80d093ea7142e3e3731b926bc545c3ef4c3
		
		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");
		
		String url = String.format(DDApi.DDAPI_ROBOT_SEND_STR, oapiHost.getValue(), accessToken);
		
		MessageDelivery messageDelivery = new MessageDelivery();
		TextMessage textMessage = new TextMessage(message);
		
		messageDelivery.withMessage(textMessage);
		
		try {
			HttpHelper.httpPost(url, messageDelivery.toJsonObject());
		} catch (Exception e) {
			LogUtils.logging(logger, url, -1, e.getMessage());
		}
		
		return 0;
	}
	
}
