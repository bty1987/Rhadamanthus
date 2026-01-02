/**
 * @File Name		: WAccessTokenServiceImpl.java
 * @Package   	: com.fanglin.common.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.wechat.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.dao.WeChatAccessTokenDao;
import com.fanglin.wechat.dao.WeChatJsapiTicketDao;
import com.fanglin.wechat.po.WeChatAccessTokenPO;
import com.fanglin.wechat.po.WeChatJsapiTicketPO;
import com.fanglin.wechat.service.WeChatAccessTokenService;
import com.fanglin.wechat.utils.WeChatApi;
import com.fanglin.wechat.vo.WeChatAccessTokenVO;
import com.fanglin.wechat.vo.WeChatJsapiTicketVO;

@Service("weChatAccessTokenService")
@Transactional(readOnly = true)
public class WeChatAccessTokenServiceImpl implements WeChatAccessTokenService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private WeChatAccessTokenDao accessTokenDao;

	@Autowired
	private WeChatJsapiTicketDao jsapiTicketDao;

	@Override
	public WeChatAccessTokenVO queryAccessToken(String company) {

		WeChatAccessTokenPO accessTokenPO = accessTokenDao.queryAccessToken(FormatUtil.decodeCompany(company));
		WeChatAccessTokenVO accessTokenVO = new WeChatAccessTokenVO();

		BeanUtil.copyProperties(accessTokenPO, accessTokenVO);

		return accessTokenVO;
	}

	@Override
	public WeChatJsapiTicketVO queryJsapiTicketForNew(String company) {

		WeChatJsapiTicketPO jsapiTicketPO = jsapiTicketDao.queryJsapiTicket(FormatUtil.decodeCompany(company));
		WeChatJsapiTicketVO jsapiTicketVO = new WeChatJsapiTicketVO();

		BeanUtil.copyProperties(jsapiTicketPO, jsapiTicketVO);

		return jsapiTicketVO;
	}

	@Override
	public int makeAccessToken(short type, String company) {

		int $company = FormatUtil.decodeCompany(company);

		// 根据 type 参数动态构建配置 key，支持不同类型的微信应用
		// type=0: 公众号, type=1: 小程序, type=2: 企业微信等
		SystemConfigPO wapi = systemConfigDao.querySystemConfig("WECHAT_WXAPI_PATH_STR");
		SystemConfigPO appid = systemConfigDao.querySystemConfig(String.format("WECHAT_APPID_%s_%s", type, $company));
		SystemConfigPO secret = systemConfigDao.querySystemConfig(String.format("WECHAT_SECRET_%s_%s", type, $company));

		String url = String.format(WeChatApi.WXAPI_GET_TOKEN_STR, wapi.getValue(), appid.getValue(), secret.getValue());

		JSONObject response = HttpHelper.httpGet(url);

		if (response != null && response.containsKey("access_token")) {
			WeChatAccessTokenPO accessTokenPO = new WeChatAccessTokenPO(response.getString("access_token"), new Date().getTime(), FormatUtil.decodeCompany(company));

			accessTokenDao.save(accessTokenPO);

			url = String.format(WeChatApi.WXAPI_GET_JSAPI_TICKET_STR, wapi.getValue(), accessTokenPO.getAccesstoken());

			response = HttpHelper.httpGet(url);

			if (response != null && response.containsKey("ticket")) {

				WeChatJsapiTicketPO jsapiTicketPO = new WeChatJsapiTicketPO(response.getString("ticket"), new Date().getTime(), FormatUtil.decodeCompany(company));

				jsapiTicketDao.save(jsapiTicketPO);
			}
		}

		return 0;
	}

	@Override
	public int deleteAccessToken() {

		long currentTime = new Date().getTime();

		accessTokenDao.deleteAccessToken(currentTime);
		jsapiTicketDao.deleteJsapiTicket(currentTime);

		return 0;
	}

}
