/**
 * @File Name		: DAccessTokenServiceImpl.java
 * @Package   	: com.fanglin.common.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.dao.DingTalkAccessTokenDao;
import com.fanglin.dingding.dao.DingTalkJsapiTicketDao;
import com.fanglin.dingding.po.DingTalkAccessTokenPO;
import com.fanglin.dingding.po.DingTalkJsapiTicketPO;
import com.fanglin.dingding.service.DingTalkAccessTokenService;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.dingding.vo.DingTalkAccessTokenVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;

@Service("dingTalkAccessTokenService")
@Transactional(readOnly = true)
public class DingTalkAccessTokenServiceImpl implements DingTalkAccessTokenService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DingTalkAccessTokenDao accessTokenDao;

	@Autowired
	private DingTalkJsapiTicketDao jsapiTicketDao;

	@Override
	public DingTalkAccessTokenVO queryAccessToken(String company) {

		DingTalkAccessTokenPO accessTokenPO = accessTokenDao.queryAccessToken(FormatUtil.decodeCompany(company));
		DingTalkAccessTokenVO accessTokenVO = new DingTalkAccessTokenVO();

		BeanUtil.copyProperties(accessTokenPO, accessTokenVO);

		return accessTokenVO;
	}

	@Override
	public int makeAccessToken(String company) {

		int $company = FormatUtil.decodeCompany(company);

		SystemConfigPO oapi = systemConfigDao.querySystemConfig("DINGTALK_OAPI_URL_STR");
		SystemConfigPO corpid = systemConfigDao.querySystemConfig("DINGTALK_CORPID_STR", $company);
		SystemConfigPO secret = systemConfigDao.querySystemConfig("DINGTALK_SECRET_STR", $company);

		if (corpid == null) {
			return 1;
		}

		String url = String.format(DDApi.DDAPI_GET_TOKEN_STR, oapi.getValue(), corpid.getValue(), secret.getValue());

		JSONObject response = HttpHelper.httpGet(url);

		if (response != null && response.containsKey("access_token")) {

			DingTalkAccessTokenPO accessTokenPO = new DingTalkAccessTokenPO(response.getString("access_token"), new Date().getTime(), FormatUtil.decodeCompany(company));

			accessTokenDao.save(accessTokenPO);

			url = String.format(DDApi.DDAPI_GET_JSAPI_TICKET_STR, oapi.getValue(), accessTokenPO.getAccesstoken());

			response = HttpHelper.httpGet(url);

			if (response != null && response.containsKey("ticket")) {

				DingTalkJsapiTicketPO jsapiTicketPO = new DingTalkJsapiTicketPO(response.getString("ticket"), new Date().getTime(), FormatUtil.decodeCompany(company));

				jsapiTicketDao.save(jsapiTicketPO);
			}
		} else {
			System.out.println(url);
			System.out.println(response.toJSONString());
		}

		return 0;
	}

	@Override
	public int batchmakeAccessToken(String company) {

		int $company = FormatUtil.decodeCompany(company);

		for (int i = 0; i <= $company; i++) {
			makeAccessToken(String.valueOf(FormatUtil.encodeCompany(i)));
		}

		return 0;
	}

	@Override
	public int deleteAccessTokenByOperateTime() {

		long currentTime = new Date().getTime();

		accessTokenDao.deleteAccessToken(currentTime);
		jsapiTicketDao.deleteJsapiTicket(currentTime);

		return 0;
	}

}
