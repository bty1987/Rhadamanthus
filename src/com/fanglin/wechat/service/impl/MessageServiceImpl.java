/**
 * @File Name		: MessageServiceImpl.java
 * @Package   	: com.fanglin.message.service.impl
 * @Version		: 1.0
 * @Date			: 2017-7-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.message.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.WAccessTokenDao;
import com.fanglin.common.dao.WXOpenUnionDao;
import com.fanglin.common.po.WAccessTokenPO;
import com.fanglin.common.po.WXOpenUnionPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.message.dao.MessageTemplateDao;
import com.fanglin.message.po.MessageTemplatePO;
import com.fanglin.message.service.MessageService;
import com.fanglin.message.vo.Notice;
import com.fanglin.message.vo.Payment;
import com.fanglin.message.vo.ServiceSchedule;
import com.fanglin.system.dao.IsvConfigDao;
import com.fanglin.system.po.IsvConfigPO;
import com.fanglin.utils.HttpHelper;
import com.fanglin.utils.WXApi;

@Service("messageService")
@Transactional(readOnly = true)
public class MessageServiceImpl implements MessageService {

	@Autowired
	private WeChatMessageTemplateDao messageTemplateDao;

	@Autowired
	private WXOpenUnionDao wxOpenUnionDao;

	@Autowired
	private WAccessTokenDao wAccessTokenDao;

	@Autowired
	private IsvConfigDao isvConfigDao;

	@Override
	@SuppressWarnings("serial")
	public int sendServiceSchedule(final ServiceSchedule serviceSchedule) throws FLException {

		WAccessTokenPO wAccessTokenPO = wAccessTokenDao.queryWAccessTokenForNew(0);
		IsvConfigPO wapi = isvConfigDao.queryIsvConfig("wapi");

		WeChatOpenUnionPO wxOpenUnionPO = wxOpenUnionDao.queryWxOpenUnion(serviceSchedule.getUnionId(), WeChatMessageTemplatePO.TYPE_PUBLIC_INT, 1);
		final WeChatMessageTemplatePO messageTemplatePO = messageTemplateDao.queryMessageTemplate("ServiceSchedule", WeChatMessageTemplatePO.TYPE_PUBLIC_INT);

		IsvConfigPO publicAppid = isvConfigDao.queryIsvConfig("appid", WeChatMessageTemplatePO.TYPE_PUBLIC_INT, 0);

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

			final IsvConfigPO server = isvConfigDao.queryIsvConfig("appid", WeChatMessageTemplatePO.TYPE_APPLET_INT, 5);

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

		IsvConfigPO wapi = isvConfigDao.queryIsvConfig("wapi");

		WAccessTokenPO wAccessTokenPO = wAccessTokenDao.queryWAccessTokenForNew(0);

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

		WAccessTokenPO wAccessTokenPO = wAccessTokenDao.queryWAccessTokenForNew(0);
		IsvConfigPO wapi = isvConfigDao.queryIsvConfig("wapi");

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
