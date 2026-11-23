/**
 * @File Name		: WecomAuthServiceImpl.java
 * @Package   	: com.fanglin.wecom.service.impl
 * @Version		: 1.0
 * @Date			: 2026-11-23
 * @Copyright		: Copyright Creators 2014
 * @Describing	: 企业微信网页授权免登服务实现
 */

package com.fanglin.wecom.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.wecom.bean.User;
import com.fanglin.wecom.service.WecomAccessTokenService;
import com.fanglin.wecom.service.WecomAuthService;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.wecom.utils.WecomApi;

@Service("wecomAuthService")
@Transactional(readOnly = true)
public class WecomAuthServiceImpl implements WecomAuthService {

	@Autowired
	private WecomAccessTokenService accessTokenService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public User getUserInfo(String code, String company) throws FLException {

		String accessToken = accessTokenService.getAccessToken(company);

		SystemConfigPO oapiHost = systemConfigDao.querySystemConfig("WECOM_OAPI_URL_STR");

		// 第一步: 网页授权code换企微userid(非企业成员仅返回openid, 无userid)
		String userInfoUrl = String.format(WecomApi.WECOM_GET_USER_INFO_STR, oapiHost.getValue(), accessToken, code);

		JSONObject userJson = HttpHelper.httpGet(userInfoUrl);

		if (userJson == null || userJson.getIntValue("errcode") != 0) {
			throw new FLException(270024, "获取企微人员信息失败");
		}

		String userid = userJson.getString("userid");

		if (StringUtils.isEmpty(userid)) {
			throw new FLException(270024, "获取企微人员信息失败");
		}

		// 第二步: 企微userid换通讯录详情取work_code工号(与ERP user.userId对齐)
		String detailUrl = String.format(WecomApi.WECOM_USER_GET_STR, oapiHost.getValue(), accessToken, userid);

		JSONObject detailJson = HttpHelper.httpGet(detailUrl);

		if (detailJson == null || detailJson.getIntValue("errcode") != 0) {
			throw new FLException(270025, "获取企微成员详情失败");
		}

		String workCode = detailJson.getString("work_code");

		if (StringUtils.isEmpty(workCode)) {
			throw new FLException(270026, "企微成员未配置工号");
		}

		return new User(userid, detailJson.getString("name"), workCode);
	}

}
