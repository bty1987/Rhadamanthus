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
import com.fanglin.wechat.dao.AccessTokenDao;
import com.fanglin.wechat.dao.JsapiTicketDao;
import com.fanglin.wechat.po.AccessTokenPO;
import com.fanglin.wechat.po.JsapiTicketPO;
import com.fanglin.wechat.service.AccessTokenService;
import com.fanglin.wechat.utils.WXApi;
import com.fanglin.wechat.vo.AccessTokenVO;

@Service("accessTokenService")
@Transactional(readOnly = true)
public class AccessTokenServiceImpl implements AccessTokenService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private AccessTokenDao accessTokenDao;

	@Autowired
	private JsapiTicketDao jsapiTicketDao;

	@Override
	public AccessTokenVO queryAccessToken(String company) {

		AccessTokenPO accessTokenPO = accessTokenDao.queryAccessToken(FormatUtil.decodeCompany(company));
		AccessTokenVO accessTokenVO = new AccessTokenVO();

		BeanUtil.copyProperties(accessTokenPO, accessTokenVO);

		return accessTokenVO;
	}

	@Override
	public int makeAccessToken(short type, String company) {

		int $company = FormatUtil.decodeCompany(company);

		SystemConfigPO wapi = systemConfigDao.querySystemConfig("WECHAT_WXAPI_PATH_STR");
		SystemConfigPO appid = systemConfigDao.querySystemConfig("WECHAT_APPID_STR", $company);
		SystemConfigPO secret = systemConfigDao.querySystemConfig("WECHAT_SECRET_STR", $company);

		String url = String.format(WXApi.WXAPI_GET_TOKEN_STR, wapi.getValue(), appid.getValue(), secret.getValue());

		JSONObject response = HttpHelper.httpGet(url);

		if (response != null && response.containsKey("access_token")) {
			AccessTokenPO accessTokenPO = new AccessTokenPO(response.getString("access_token"), new Date().getTime(), FormatUtil.decodeCompany(company));

			accessTokenDao.save(accessTokenPO);

			url = String.format(WXApi.WXAPI_GET_JSAPI_TICKET_STR, wapi.getValue(), accessTokenPO.getAccesstoken());

			response = HttpHelper.httpGet(url);

			if (response != null && response.containsKey("ticket")) {

				JsapiTicketPO jsapiTicketPO = new JsapiTicketPO(response.getString("ticket"), new Date().getTime(), FormatUtil.decodeCompany(company));

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
