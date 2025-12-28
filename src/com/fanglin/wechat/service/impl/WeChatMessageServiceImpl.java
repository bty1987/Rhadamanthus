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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.HttpUtil;
import com.fanglin.wechat.dao.WeChatAccessTokenDao;
import com.fanglin.wechat.dao.WeChatMessageTemplateDao;
import com.fanglin.wechat.dao.impl.WXOpenUnionDao;
import com.fanglin.wechat.po.WeChatAccessTokenPO;
import com.fanglin.wechat.po.WeChatMessageTemplatePO;
import com.fanglin.wechat.po.WeChatOpenUnionPO;
import com.fanglin.wechat.service.WeChatMessageService;
import com.fanglin.wechat.utils.WeChatApi;

/**
 * 微信消息服务实现 用于发送微信模板消息（支付通知、服务进度通知等）
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

	@Autowired
	private WeChatMessageTemplateDao messageTemplateDao;

	@Autowired
	private WXOpenUnionDao wxOpenUnionDao;

	@Autowired
	private WeChatAccessTokenDao weChatAccessTokenDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	@SuppressWarnings("serial")
	public int sendServiceSchedule(final ServiceSchedule serviceSchedule) throws FLException {

		WeChatAccessTokenPO wAccessTokenPO = weChatAccessTokenDao.queryAccessToken(0);
		SystemConfigPO wapi = systemConfigDao.querySystemConfig("wapi");

		WeChatOpenUnionPO wxOpenUnionPO = wxOpenUnionDao.queryWxOpenUnion(serviceSchedule.getUnionId(), WeChatMessageTemplatePO.TYPE_PUBLIC_INT, 1);
		final WeChatMessageTemplatePO messageTemplatePO = messageTemplateDao.queryMessageTemplate("ServiceSchedule", WeChatMessageTemplatePO.TYPE_PUBLIC_INT);

		SystemConfigPO publicAppid = systemConfigDao.querySystemConfig("appid", WeChatMessageTemplatePO.TYPE_PUBLIC_INT, 0);

		if (wxOpenUnionPO == null) return 0;

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("touser", wxOpenUnionPO.getOpenId());

		params.put("appid", publicAppid.getValue());
		params.put("template_id", messageTemplatePO.getNo());

		String ssurl = serviceSchedule.getUrl();
		String mturl = messageTemplatePO.getUrl();

		if (ssurl != null && !"".equals(ssurl)) {
			params.put("url", ssurl);
		} else if (mturl != null && !"".equals(mturl)) {
			params.put("url", mturl);
		}

		final String miniprogrom = serviceSchedule.getMiniprogram();

		if (miniprogrom != null && !"".equals(miniprogrom)) {

			final SystemConfigPO server = systemConfigDao.querySystemConfig("appid", WeChatMessageTemplatePO.TYPE_APPLET_INT, 5);

			params.put("miniprogram", new HashMap<String, String>() {
				{
					put("appid", server.getValue());
					put("pagepath", miniprogrom);
				}
			});
		}

		Map<String, Object> data = new HashMap<String, Object>();

		data.put("first", new HashMap<String, String>() {
			{
				put("value", String.format("尊敬的客户 , 您的%s进度如下:", serviceSchedule.getName()));
				put("color", "#173177");
			}
		});

		data.put("keyword1", new HashMap<String, String>() {
			{
				put("value", serviceSchedule.getOrderId());
				put("color", "#173177");
			}
		});

		data.put("keyword2", new HashMap<String, String>() {
			{
				put("value", serviceSchedule.getContent());
				put("color", "#173177");
			}
		});

		data.put("keyword3", new HashMap<String, String>() {
			{
				put("value", serviceSchedule.getTime());
				put("color", "#173177");
			}
		});

		data.put("remark", new HashMap<String, String>() {
			{
				put("value", messageTemplatePO.getRemark());
				put("color", "#173177");
			}
		});

		params.put("data", data);

		mturl = String.format(WXApi.WXAPI_MESSAGE_TEMPLATE_SEND_STR, wapi.getValue(), wAccessTokenPO.getAccesstoken());

		System.out.println(mturl);
		System.out.println(params);

		HttpHelper.httpPost(mturl, params);

		return 0;
	}

	@Override
	@SuppressWarnings("serial")
	public int sendPayment(final Payment payment) throws FLException {

		WeChatOpenUnionPO wxOpenUnionPO = wxOpenUnionDao.queryWxOpenUnion(payment.getUnionId(), WeChatOpenUnionPO.TYPE_PUBLIC_INT);
		final WeChatMessageTemplatePO messageTemplatePO = messageTemplateDao.queryMessageTemplate("Payment", WeChatMessageTemplatePO.TYPE_PUBLIC_INT, 1);

		if (wxOpenUnionPO == null || messageTemplatePO == null) return 0;

		SystemConfigPO wapi = systemConfigDao.querySystemConfig("wapi");

		WeChatAccessTokenPO wAccessTokenPO = wAccessTokenDao.queryWAccessTokenForNew(0);

		String _url = messageTemplatePO.getUrl();

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("touser", wxOpenUnionPO.getOpenId());
		params.put("template_id", messageTemplatePO.getNo());

		if (_url != null && !"".equals(_url)) params.put("url", _url);

		Map<String, Object> data = new HashMap<String, Object>();

		data.put("first", new HashMap<String, String>() {
			{
				put("value", "尊敬的客户 , 您有款项更新信息");
			}
		});

		data.put("keyword1", new HashMap<String, String>() {
			{
				put("value", payment.getName());
			}
		});

		data.put("keyword2", new HashMap<String, String>() {
			{
				put("value", payment.getMoney());
			}
		});

		data.put("keyword3", new HashMap<String, String>() {
			{
				put("value", payment.getComment());
			}
		});

		data.put("remark", new HashMap<String, String>() {
			{
				put("value", messageTemplatePO.getRemark());
			}
		});

		params.put("data", data);

		String url = String.format(WXApi.WXAPI_MESSAGE_TEMPLATE_SEND_STR, wapi.getValue(), wAccessTokenPO.getAccesstoken());

		System.out.println(url);
		System.out.println(params);

		HttpHelper.httpPost(url, params);

		return 0;
	}

	@Override
	@SuppressWarnings("serial")
	public int sendNotice(final Notice notice) throws FLException {

		WeChatAccessTokenPO wAccessTokenPO = wAccessTokenDao.queryWAccessTokenForNew(0);
		SystemConfigPO wapi = systemConfigDao.querySystemConfig("wapi");

		WeChatOpenUnionPO wxOpenUnionPO = wxOpenUnionDao.queryWxOpenUnion(notice.getUnionId(), WeChatMessageTemplatePO.TYPE_PUBLIC_INT);
		final WeChatMessageTemplatePO messageTemplatePO = messageTemplateDao.queryMessageTemplate("Notice", WeChatMessageTemplatePO.TYPE_PUBLIC_INT);

		if (wxOpenUnionPO == null || messageTemplatePO == null) return 0;

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("touser", wxOpenUnionPO.getOpenId());
		params.put("template_id", messageTemplatePO.getNo());

		String ssurl = notice.getUrl();
		String mturl = messageTemplatePO.getUrl();

		if (ssurl != null && !"".equals(ssurl)) {
			params.put("url", ssurl);
		} else if (mturl != null && !"".equals(mturl)) {
			params.put("url", mturl);
		}

		String url = messageTemplatePO.getUrl();
		if (url != null && !"".equals(url)) params.put("url", url);

		final String miniprogrom = notice.getMiniprogram();

		if (miniprogrom != null && !"".equals(miniprogrom)) {

			params.put("miniprogram", new HashMap<String, String>() {
				{
					put("appid", "wxccaeace32770eac2"); // wxc6f28712476d826b
					put("pagepath", miniprogrom);
				}
			});
		}

		Map<String, Object> data = new HashMap<String, Object>();

		data.put("first", new HashMap<String, String>() {
			{
				put("value", "你好，你有一个新客户预约!");
			}
		});

		data.put("keyword1", new HashMap<String, String>() {
			{
				put("value", notice.getName());
			}
		});

		data.put("keyword2", new HashMap<String, String>() {
			{
				put("value", notice.getPhone());
			}
		});

		data.put("keyword3", new HashMap<String, String>() {
			{
				put("value", notice.getContent());
			}
		});

		data.put("keyword4", new HashMap<String, String>() {
			{
				put("value", notice.getTime());
			}
		});

		data.put("remark", new HashMap<String, String>() {
			{
				put("value", messageTemplatePO.getRemark());
			}
		});

		params.put("data", data);

		url = String.format(WXApi.WXAPI_MESSAGE_TEMPLATE_SEND_STR, wapi.getValue(), "", wAccessTokenPO.getAccesstoken());

		System.out.println(url);
		System.out.println(params);

		HttpHelper.httpPost(url, params);

		return 0;
	}

}
