package com.fanglin.dingding.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.bean.DingMessage;
import com.fanglin.dingding.bean.LinkMessage;
import com.fanglin.dingding.bean.OAMessage;
import com.fanglin.dingding.bean.TextMessage;
import com.fanglin.dingding.service.DingTalkAuthService;
import com.fanglin.dingding.service.DingTalkMessageService;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.information.po.MessagePO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.LogUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service("dingTalkMessageService")
@Transactional(readOnly = true)
public class DingTalkMessageServiceImpl implements DingTalkMessageService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private DingTalkAuthService dingTalkAuthService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public short sendMessage(String receiveId, String senderName, String contents, Long aimid, int company) throws FLException {

		SystemConfigPO deliverValue = systemConfigDao.querySystemConfig("messageAgentId", company);
		SystemConfigPO jumpValue = systemConfigDao.querySystemConfig("messageUrl", company);

		if (deliverValue == null || jumpValue == null) {
			return -1;
		}

		String accessToken = dingTalkAuthService.getAccessToken(FormatUtil.encodeCompany(company));

		if (accessToken == null) {
			return -1;
		}

		OAMessage oa = new OAMessage();

		if (aimid != null) {
			oa.setMessage_url(String.format(jumpValue.getValue(), aimid));
		}

		OAMessage.Head head = new OAMessage.Head();

		head.bgcolor = "FFDFD130";
		oa.setHead(head);
		OAMessage.Body body = new OAMessage.Body();

		body.content = "内容  : " + contents;
		body.author = "发送人 : " + senderName;

		oa.setBody(body);

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		String url = String.format(DDApi.DDAPI_MESSAGE_SEND_STR, oapiHost.getValue(), accessToken);

		JSONObject json = HttpHelper.httpPost(url, oa.delivery(deliverValue.getValue(), receiveId, ""));

		if (json == null) {
			LogUtils.logging(logger, url, company, receiveId);
			// throw new FLException(270007, "发送消息失败");
		} else if (json.getInteger("errcode") != 0) {
			LogUtils.logging(logger, url, json.getInteger("errcode"), json.getString("errmsg"));
			// throw new FLException(json.getInteger("errcode"), json.getString("errmsg"));
		}

		return json == null ? MessagePO.DRESULT_FAIL_INT : json.getShort("errcode");
	}

	@Override
	public int sendDing(String receiveId, String contents, int company) throws FLException {

		SystemConfigPO dingAgentId = systemConfigDao.querySystemConfig("dingAgentId", company);

		if (dingAgentId == null) {
			return -1;
		}

		String accessToken = dingTalkAuthService.getAccessToken(FormatUtil.encodeCompany(company));

		if (accessToken == null) {
			return -1;
		}

		String url = String.format(DDApi.DDAPI_DING_SEND_STR, "https://api.dingtalk.com", accessToken);

		Map<String, String> headers = new HashMap<String, String>();

		headers.put("x-acs-dingtalk-access-token", accessToken);

		DingMessage ding = new DingMessage();

		JSONObject json = HttpHelper.httpPost(url, headers, ding.phone(dingAgentId.getValue(), receiveId, contents));

		if (json == null) {
			LogUtils.logging(logger, url, company, receiveId);
			// throw new FLException(270007, "发送消息失败");
		} else {
			System.out.println(json.toJSONString());
		}

		return MessagePO.DRESULT_SUCCESS_INT;
	}

	public static void main(String[] args) {

		String accessToken = "9905a93cf0ff38d8aeacd988f85cd9f6";

		String url = String.format(DDApi.DDAPI_DING_SEND_STR, "https://api.dingtalk.com");

		Map<String, String> headers = new HashMap<String, String>();

		headers.put("x-acs-dingtalk-access-token", accessToken);

		DingMessage ding = new DingMessage();

		JSONObject json = HttpHelper.httpPost(url, headers, ding.phone("dingonatbwxggsycm8go", "FL-00083", "test"));

		System.out.println(json);

	}

	@Override
	public int sendMessage(String accessToken, String message) {

		// 返单 https://oapi.dingtalk.com/robot/send?access_token=71449a2f7b476bf25fde8e568253c80d093ea7142e3e3731b926bc545c3ef4c3
		// https://oapi.dingtalk.com//message/send?access_token=71449a2f7b476bf25fde8e568253c80d093ea7142e3e3731b926bc545c3ef4c3

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		String url = String.format(DDApi.DDAPI_ROBOT_SEND_STR, oapiHost.getValue(), accessToken);

		TextMessage text = new TextMessage(message);

		try {
			HttpHelper.httpPost(url, text.delivery());
		} catch (Exception e) {
			LogUtils.logging(logger, url, -1, e.getMessage());
		}

		return 0;
	}

	@Override
	public int sendLink(String accessToken, String title, String content, String jump, Integer company, Object... args) {

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("oapiHost");

		SystemConfigPO jumpUrl = systemConfigDao.querySystemConfig(jump, company);

		String url = String.format(DDApi.DDAPI_ROBOT_SEND_STR, oapiHost.getValue(), accessToken);

		if (accessToken == null || jumpUrl == null) {
			return -1;
		}

		LinkMessage link = new LinkMessage(String.format(jumpUrl.getValue(), args), "", title, content);

		JSONObject json = null;

		try {
			json = HttpHelper.httpPost(url, link.delivery());
		} catch (Exception e) {
			LogUtils.logging(logger, url, -1, e.getMessage());
		}

		return json == null ? MessagePO.DRESULT_FAIL_INT : json.getShort("errcode");
	}

}
