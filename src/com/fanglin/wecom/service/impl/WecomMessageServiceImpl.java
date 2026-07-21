/**
 * @File Name		: WecomMessageServiceImpl.java
 * @Package   	: com.fanglin.wecom.service.impl
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信消息推送服务实现
 */

package com.fanglin.wecom.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.LogUtils;
import com.fanglin.wecom.service.WecomAccessTokenService;
import com.fanglin.wecom.service.WecomMessageService;
import com.fanglin.wecom.utils.WecomApi;

@Service("wecomMessageService")
@Transactional(readOnly = true)
public class WecomMessageServiceImpl implements WecomMessageService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	/** textcard 无跳转时的占位 URL (企业微信要求 url 字段必填且格式合法) */
	private static final String DEFAULT_TEXTCARD_URL = "https://work.weixin.qq.com/";

	@Autowired
	private WecomAccessTokenService wecomAccessTokenService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public int sendTextCard(String receiveId, String title, String description, String jumpUrl, int company) {

		SystemConfigPO oapi = systemConfigDao.querySystemConfig("WECOM_OAPI_URL_STR");
		SystemConfigPO agentId = systemConfigDao.querySystemConfig("WECOM_AGENTID_STR", company);

		if (oapi == null || agentId == null) {
			logger.warn("WecomMessage sendTextCard config missing. company={}", company);
			return -1;
		}

		Integer agentIdValue = parseIntSafely(agentId.getValue());
		if (agentIdValue == null) {
			logger.error("WecomMessage sendTextCard invalid agentId [{}]. company={}", agentId.getValue(), company);
			return -1;
		}

		String accessToken = wecomAccessTokenService.getAccessToken(FormatUtil.encodeCompany(company));
		if (accessToken == null || accessToken.length() == 0) {
			return -1;
		}

		JSONObject textcard = new JSONObject();
		textcard.put("title", title == null ? "" : title);
		textcard.put("description", description == null ? "" : description);
		textcard.put("url", (jumpUrl == null || jumpUrl.length() == 0) ? DEFAULT_TEXTCARD_URL : jumpUrl);
		textcard.put("btmtxt", "");

		JSONObject params = buildAppEnvelope(receiveId, agentIdValue, "textcard");
		params.put("textcard", textcard);

		return postAppMessage(oapi.getValue(), accessToken, params);
	}

	@Override
	public int sendText(String receiveId, String content, int company) {

		SystemConfigPO oapi = systemConfigDao.querySystemConfig("WECOM_OAPI_URL_STR");
		SystemConfigPO agentId = systemConfigDao.querySystemConfig("WECOM_AGENTID_STR", company);

		if (oapi == null || agentId == null) {
			logger.warn("WecomMessage sendText config missing. company={}", company);
			return -1;
		}

		Integer agentIdValue = parseIntSafely(agentId.getValue());
		if (agentIdValue == null) {
			logger.error("WecomMessage sendText invalid agentId [{}]. company={}", agentId.getValue(), company);
			return -1;
		}

		String accessToken = wecomAccessTokenService.getAccessToken(FormatUtil.encodeCompany(company));
		if (accessToken == null || accessToken.length() == 0) {
			return -1;
		}

		JSONObject text = new JSONObject();
		text.put("content", content == null ? "" : content);

		JSONObject params = buildAppEnvelope(receiveId, agentIdValue, "text");
		params.put("text", text);

		return postAppMessage(oapi.getValue(), accessToken, params);
	}

	@Override
	public int sendGroupText(String webhookKey, String content) {

		SystemConfigPO oapi = systemConfigDao.querySystemConfig("WECOM_OAPI_URL_STR");

		if (oapi == null || webhookKey == null || webhookKey.length() == 0) {
			return -1;
		}

		JSONObject text = new JSONObject();
		text.put("content", content == null ? "" : content);

		JSONObject params = new JSONObject();
		params.put("msgtype", "text");
		params.put("text", text);

		return postWebhook(oapi.getValue(), webhookKey, params);
	}

	@Override
	public int sendGroupMarkdown(String webhookKey, String markdown) {

		SystemConfigPO oapi = systemConfigDao.querySystemConfig("WECOM_OAPI_URL_STR");

		if (oapi == null || webhookKey == null || webhookKey.length() == 0) {
			return -1;
		}

		JSONObject markdownObj = new JSONObject();
		markdownObj.put("content", markdown == null ? "" : markdown);

		JSONObject params = new JSONObject();
		params.put("msgtype", "markdown");
		params.put("markdown", markdownObj);

		return postWebhook(oapi.getValue(), webhookKey, params);
	}

	// ==================== 内部辅助方法 ====================

	/**
	 * 构造应用消息外层信封 (touser / msgtype / agentid / safe / enable_id_trans)
	 */
	private JSONObject buildAppEnvelope(String receiveId, int agentId, String msgtype) {

		JSONObject params = new JSONObject();
		params.put("touser", receiveId);
		params.put("msgtype", msgtype);
		params.put("agentid", agentId);
		params.put("safe", 0);
		params.put("enable_id_trans", 0);

		return params;
	}

	/**
	 * 发送应用消息并统一处理响应/异常
	 * @return errcode (0=成功), -1=异常或响应为空
	 */
	private int postAppMessage(String oapiHost, String accessToken, JSONObject params) {

		String url = String.format(WecomApi.WECOM_MESSAGE_SEND_STR, oapiHost, accessToken);

		try {
			JSONObject json = HttpHelper.httpPost(url, params);

			if (json == null) {
				LogUtils.logging(logger, url, -1, "response is null");
				return -1;
			}

			int errcode = json.getIntValue("errcode");
			if (errcode != 0) {
				LogUtils.logging(logger, url, errcode, json.getString("errmsg"));
			}

			return errcode;
		} catch (Exception e) {
			LogUtils.logging(logger, url, -1, e.getMessage());
			return -1;
		}
	}

	/**
	 * 发送群机器人消息并统一处理响应/异常
	 */
	private int postWebhook(String oapiHost, String webhookKey, JSONObject params) {

		String url = String.format(WecomApi.WECOM_WEBHOOK_SEND_STR, oapiHost, webhookKey);

		try {
			JSONObject json = HttpHelper.httpPost(url, params);

			if (json == null) {
				LogUtils.logging(logger, url, -1, "response is null");
				return -1;
			}

			int errcode = json.getIntValue("errcode");
			if (errcode != 0) {
				LogUtils.logging(logger, url, errcode, json.getString("errmsg"));
			}

			return errcode;
		} catch (Exception e) {
			LogUtils.logging(logger, url, -1, e.getMessage());
			return -1;
		}
	}

	/**
	 * 安全解析 agentid, 非法值返回 null
	 */
	private Integer parseIntSafely(String value) {

		if (value == null || value.length() == 0) {
			return null;
		}

		try {
			return Integer.valueOf(value.trim());
		} catch (NumberFormatException e) {
			return null;
		}
	}

}
