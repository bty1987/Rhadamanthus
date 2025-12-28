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

import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.wechat.dao.WeChatAccessTokenDao;
import com.fanglin.wechat.dao.WeChatMessageTemplateDao;
import com.fanglin.wechat.dao.WeChatOpenUnionDao;
import com.fanglin.wechat.po.WeChatAccessTokenPO;
import com.fanglin.wechat.po.WeChatMessageTemplatePO;
import com.fanglin.wechat.po.WeChatOpenUnionPO;
import com.fanglin.wechat.service.WeChatMessageService;
import com.fanglin.wechat.utils.WeChatApi;
import com.fanglin.wechat.utils.HttpHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 微信消息服务实现 用于发送微信模板消息（支付通知、服务进度通知等）
 */
@Service("weChatMessageService")
@Transactional(readOnly = true)
public class WeChatMessageServiceImpl implements WeChatMessageService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private WeChatAccessTokenDao weChatAccessTokenDao;

	@Autowired
	private WeChatMessageTemplateDao messageTemplateDao;

	@Autowired
	private WeChatOpenUnionDao wxOpenUnionDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public int sendPaymentMessage(int type, String name, String orderId, float money, String comment) {
		// 注意：此方法通过 ISV 服务发送，不直接调用微信 API
		// 如需直接调用微信 API，需要提供 unionId 参数来获取用户的 OpenID
		logger.warn("sendPaymentMessage 方法通过 ISV 服务发送，未直接调用微信 API");
		return 0;
	}

	@Override
	public int sendServiceSchedule(String unionId, String name, String orderId, String content) {
		return sendServiceSchedule(unionId, name, orderId, content, null);
	}

	@Override
	@SuppressWarnings("serial")
	public int sendServiceSchedule(String unionId, String name, String orderId, String content, String path) {

		try {
			// 获取 AccessToken
			WeChatAccessTokenPO wAccessTokenPO = weChatAccessTokenDao.queryAccessToken(0);
			SystemConfigPO wapi = systemConfigDao.querySystemConfig("wapi");

			// 查询用户的 OpenID
			WeChatOpenUnionPO wxOpenUnionPO = wxOpenUnionDao.queryWeChatOpenUnion(unionId,
					WeChatMessageTemplatePO.TYPE_PUBLIC_INT, 1);
			final WeChatMessageTemplatePO messageTemplatePO = messageTemplateDao.queryMessageTemplate(
					"ServiceSchedule", WeChatMessageTemplatePO.TYPE_PUBLIC_INT);

			SystemConfigPO publicAppid = systemConfigDao.querySystemConfig("WECHAT_APPID_PUBLIC_INT", 0);

			if (wxOpenUnionPO == null) {
				logger.warn("未找到用户信息: unionId={}", unionId);
				return 0;
			}

			// 构建微信模板消息参数
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("touser", wxOpenUnionPO.getOpenId());
			params.put("appid", publicAppid.getValue());
			params.put("template_id", messageTemplatePO.getNo());

			// 设置跳转 URL
			String mturl = messageTemplatePO.getUrl();
			if (path != null && !"".equals(path) && path.startsWith("http")) {
				params.put("url", path);
			} else if (mturl != null && !"".equals(mturl)) {
				params.put("url", mturl);
			}

			// 设置小程序路径
			final String miniprogram = path != null && !path.startsWith("http") ? path : null;
			if (miniprogram != null && !"".equals(miniprogram)) {
				final SystemConfigPO server = systemConfigDao.querySystemConfig("WECHAT_APPID_APPLET_INT"
						, 5);
				params.put("miniprogram", new HashMap<String, String>() {
					{
						put("appid", server.getValue());
						put("pagepath", miniprogram);
					}
				});
			}

			// 构建消息数据
			Map<String, Object> data = new HashMap<String, Object>();
			data.put("first", new HashMap<String, String>() {
				{
					put("value", String.format("尊敬的客户 , 您的%s进度如下:", name));
					put("color", "#173177");
				}
			});

			data.put("keyword1", new HashMap<String, String>() {
				{
					put("value", orderId);
					put("color", "#173177");
				}
			});

			data.put("keyword2", new HashMap<String, String>() {
				{
					put("value", content);
					put("color", "#173177");
				}
			});

			data.put("keyword3", new HashMap<String, String>() {
				{
					put("value", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
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

			// 调用微信 API 发送模板消息
			String url = String.format(WeChatApi.WXAPI_MESSAGE_TEMPLATE_SEND_STR, wapi.getValue(),
					wAccessTokenPO.getAccesstoken());

			logger.info("发送服务进度通知: url={}, params={}", url, params);
			HttpHelper.httpPost(url, params);

			return 0;
		} catch (Exception e) {
			logger.error("发送服务进度通知失败: unionId={}, orderId={}, error={}", unionId, orderId, e.getMessage(), e);
			return -1;
		}
	}

	@Override
	@SuppressWarnings("serial")
	public int sendPayment(String unionId, String name, String orderId, String money, String comment) {

		try {
			// 查询用户的 OpenID
			WeChatOpenUnionPO wxOpenUnionPO = wxOpenUnionDao.queryWeChatOpenUnion(unionId,
					WeChatOpenUnionPO.TYPE_PUBLIC_INT);
			final WeChatMessageTemplatePO messageTemplatePO = messageTemplateDao.queryMessageTemplate(
					"Payment", WeChatMessageTemplatePO.TYPE_PUBLIC_INT, 1);

			if (wxOpenUnionPO == null || messageTemplatePO == null) {
				logger.warn("用户信息或消息模板不存在: unionId={}", unionId);
				return 0;
			}

			// 获取微信 API 配置
			SystemConfigPO wapi = systemConfigDao.querySystemConfig("wapi");
			WeChatAccessTokenPO wAccessTokenPO = weChatAccessTokenDao.queryAccessToken(0);

			// 构建微信模板消息参数
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("touser", wxOpenUnionPO.getOpenId());
			params.put("template_id", messageTemplatePO.getNo());

			// 设置跳转 URL
			String _url = messageTemplatePO.getUrl();
			if (_url != null && !"".equals(_url)) {
				params.put("url", _url);
			}

			// 构建消息数据
			Map<String, Object> data = new HashMap<String, Object>();
			data.put("first", new HashMap<String, String>() {
				{
					put("value", "尊敬的客户 , 您有款项更新信息");
				}
			});

			data.put("keyword1", new HashMap<String, String>() {
				{
					put("value", name);
				}
			});

			data.put("keyword2", new HashMap<String, String>() {
				{
					put("value", money);
				}
			});

			data.put("keyword3", new HashMap<String, String>() {
				{
					put("value", comment);
				}
			});

			data.put("remark", new HashMap<String, String>() {
				{
					put("value", messageTemplatePO.getRemark());
				}
			});

			params.put("data", data);

			// 调用微信 API 发送模板消息
			String url = String.format(WeChatApi.WXAPI_MESSAGE_TEMPLATE_SEND_STR, wapi.getValue(),
					wAccessTokenPO.getAccesstoken());

			logger.info("发送支付通知: url={}, params={}", url, params);
			HttpHelper.httpPost(url, params);

			return 0;
		} catch (Exception e) {
			logger.error("发送支付通知失败: unionId={}, orderId={}, error={}", unionId, orderId, e.getMessage(), e);
			return -1;
		}
	}

	@Override
	@SuppressWarnings("serial")
	public int sendNotice(String unionId, String name, String phone, String content, String url, String miniprogram) {

		try {
			// 获取 AccessToken
			WeChatAccessTokenPO wAccessTokenPO = weChatAccessTokenDao.queryAccessToken(0);
			SystemConfigPO wapi = systemConfigDao.querySystemConfig("wapi");

			// 查询用户的 OpenID
			WeChatOpenUnionPO wxOpenUnionPO = wxOpenUnionDao.queryWeChatOpenUnion(unionId,
					WeChatMessageTemplatePO.TYPE_PUBLIC_INT);
			final WeChatMessageTemplatePO messageTemplatePO = messageTemplateDao.queryMessageTemplate(
					"Notice", WeChatMessageTemplatePO.TYPE_PUBLIC_INT);

			if (wxOpenUnionPO == null || messageTemplatePO == null) {
				logger.warn("用户信息或消息模板不存在: unionId={}", unionId);
				return 0;
			}

			// 构建微信模板消息参数
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("touser", wxOpenUnionPO.getOpenId());
			params.put("template_id", messageTemplatePO.getNo());

			// 设置跳转 URL
			String ssurl = url;
			String mturl = messageTemplatePO.getUrl();

			if (ssurl != null && !"".equals(ssurl)) {
				params.put("url", ssurl);
			} else if (mturl != null && !"".equals(mturl)) {
				params.put("url", mturl);
			}

			// 设置小程序路径
			if (miniprogram != null && !"".equals(miniprogram)) {
				params.put("miniprogram", new HashMap<String, String>() {
					{
						put("appid", "wxccaeace32770eac2"); // wxc6f28712476d826b
						put("pagepath", miniprogram);
					}
				});
			}

			// 构建消息数据
			Map<String, Object> data = new HashMap<String, Object>();
			data.put("first", new HashMap<String, String>() {
				{
					put("value", "你好，你有一个新客户预约!");
				}
			});

			data.put("keyword1", new HashMap<String, String>() {
				{
					put("value", name);
				}
			});

			data.put("keyword2", new HashMap<String, String>() {
				{
					put("value", phone);
				}
			});

			data.put("keyword3", new HashMap<String, String>() {
				{
					put("value", content);
				}
			});

			data.put("keyword4", new HashMap<String, String>() {
				{
					put("value", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
				}
			});

			data.put("remark", new HashMap<String, String>() {
				{
					put("value", messageTemplatePO.getRemark());
				}
			});

			params.put("data", data);

			// 调用微信 API 发送模板消息
			String finalUrl = String.format(WeChatApi.WXAPI_MESSAGE_TEMPLATE_SEND_STR, wapi.getValue(),
					wAccessTokenPO.getAccesstoken());

			logger.info("发送通知消息: url={}, params={}", finalUrl, params);
			HttpHelper.httpPost(finalUrl, params);

			return 0;
		} catch (Exception e) {
			logger.error("发送通知消息失败: unionId={}, error={}", unionId, e.getMessage(), e);
			return -1;
		}
	}

}
