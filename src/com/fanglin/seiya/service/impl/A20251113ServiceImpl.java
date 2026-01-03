/**
 * @File Name		: ApprovalServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.seiya.service.impl;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.seiya.service.A20251113Service;
import com.fanglin.seiya.utils.CryptoUtils;
import com.fanglin.seiya.vo.SsoToken;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.SystemConfig;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service("A20251113Service")
@Transactional(readOnly = true)
public class A20251113ServiceImpl implements A20251113Service {

	private static final Logger logger = LoggerFactory.getLogger(A20251113ServiceImpl.class);

	@Autowired
	private UserDao userDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public String registAuthCode(String osstoken) throws FLException {

		try {

			String clientId = "sso-erp-pc";
			String redirectUrl = osstoken;
			String state = UUID.randomUUID().toString().replace("-", "").substring(0, 10);

			SystemConfigPO ssourl = systemConfigDao.querySystemConfig("SSO_URL_STR");

			String url = String.format("%s/admin-api/user/auth/sso/token?clientId=%s&state=%s&redirectUri=%s", ssourl.getValue(), clientId, state, java.net.URLEncoder.encode(redirectUrl, "UTF-8"));

			System.out.println(url);

			return url;
		} catch (UnsupportedEncodingException e) {
			logger.error("注册授权码失败", e);
			throw new FLException(110000, "系统处理问题");
		}
	}

	@Override
	public String exchangeAuthCode(String osstoken) throws FLException {

		try {

			SystemConfigPO ssosecret = systemConfigDao.querySystemConfig("SSO_SECRET_STR");

			SsoToken token = CryptoUtils.decryptFromToken(osstoken, ssosecret.getValue(), SsoToken.class);

			String userId = token.getCode();

			UserPO userPO = userDao.queryUserByUserId(userId);

			if (userPO == null) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			if (userPO.getStatus() != UserPO.STATUS_ONJOB_INT) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			Authentication authentication = new Authentication(userPO.getUserId(), userPO.getCurrentName(), userPO.getRole().getRid(), (new Date()).getTime(), true, userPO.getCompany(), userPO.getFreedom());

			authentication.setCompany(userPO.getCompany());

			return AESHelper.encrypt(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("交换授权码失败", e);
			throw new FLException(110000, "系统处理问题");
		}
	}

	@Override
	public String socialAuthCode(String domain) throws FLException {

		SystemConfigPO ssourl = systemConfigDao.querySystemConfig("SSO_URL_STR");

		String url = String.format("%s/admin-api/user/auth/sso/social-auth-redirect?redirectUri=%s&socialType=29", ssourl.getValue(), domain);

		logger.info(url);

		JSONObject response = com.fanglin.utils.HttpUtil.httpGet(url);

		logger.info(response.toJSONString());

		return response.getString("data");
	}

	@Override
	public String stateAuthCode(String socialCode, String socialState) throws FLException {

		SystemConfigPO ssourl = systemConfigDao.querySystemConfig("SSO_URL_STR");

		String url = String.format("%s/admin-api/user/auth/sso/social-login", ssourl.getValue());

		JSONObject params = new JSONObject();

		params.put("socialCode", socialCode);
		params.put("socialState", socialState);

		params.put("socialType", "29");

		JSONObject response = com.fanglin.utils.HttpUtil.httpPost(url, params);

		System.out.println(response);

		if (response == null) {
			throw new FLException(110000, "系统处理问题");
		}

		// if (response.getInteger("code") == 0 && response.getJSONObject("data") != null) {
		// return exchangeAuthCode(response.getJSONObject("data").getString("accessToken"));
		// }

		List<UserPO> userPOs = userDao.queryUserByPhoneAIdent(response.getJSONObject("data").getString("phone"), "-1");

		if (userPOs != null && userPOs.size() != 0) {

			UserPO userPO = userPOs.get(0);

			Authentication authentication = new Authentication(userPO.getUserId(), userPO.getCurrentName(), userPO.getRole().getRid(), (new Date()).getTime(), true, userPO.getCompany(), userPO.getFreedom());

			authentication.setCompany(userPO.getCompany());

			return AESHelper.encrypt(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));
		}

		return null;
	}

	@Override
	public int logoutAuthCode(String userId, String osstoken, String domain) throws FLException {

		try {

			SystemConfigPO ssourl = systemConfigDao.querySystemConfig("SSO_URL_STR");
			SystemConfigPO ssosecret = systemConfigDao.querySystemConfig("SSO_SECRET_STR");

			SsoToken token = CryptoUtils.decryptFromToken(osstoken, ssosecret.getValue(), SsoToken.class);

			Map<String, String> simplifiedMap = new HashMap<String, String>();

			simplifiedMap.put("code", token.getCode());
			simplifiedMap.put("token", token.getToken());
			simplifiedMap.put("domain", domain);

			String ticket = CryptoUtils.encryptToToken(simplifiedMap, ssosecret.getValue());

			Map<String, String> params = new HashMap<String, String>();

			params.put("clientId", "sso-erp-pc");
			params.put("ticket", ticket);

			String checkUrl = String.format("%s/admin-api/user/auth/sso/check-token", ssourl.getValue());

			System.out.println(com.fanglin.utils.HttpUtil.httpPost(checkUrl, params)); //

			String logoutUrl = String.format("%s/admin-api/user/auth/sso/logout", ssourl.getValue());

			System.out.println(com.fanglin.utils.HttpUtil.httpPost(logoutUrl, params));

		} catch (Exception e) {
			logger.error("登出授权码失败", e);
			throw new FLException(110000, "系统处理问题");
		}

		return 0;
	}

	public static void main(String[] args) {

		String url = String.format("%s/admin-api/user/auth/sso/social-login", "https://daily-gateway.fanglin.vip");

		JSONObject params = new JSONObject();

		params.put("socialCode", "P3J2nN9ZLLOms90K56cPZ91A5jaEA6SN4XLvk5cF55o");
		params.put("socialState", "a75218c39570f9e86f956731b622171e");

		params.put("socialType", "20");

		JSONObject response = com.fanglin.utils.HttpUtil.httpPost(url, params);

		System.out.println(response);
	}

	public static void main1(String[] args) throws Exception {

		String clientId = "sso-erp-pc";
		String redirectUrl = "http://192.168.5.21/";
		String state = "GupLWfSXuyQvf5gh";
		String url = "https://daily-gateway.fanglin.vip/admin-api/user/auth/sso/token" + "?clientId=" + clientId + "&state=" + state + "&redirectUri=" + java.net.URLEncoder.encode(redirectUrl, "UTF-8");

		System.out.println(url);

		// // String ssoToken2 = "http://192.168.5.21/?ssoToken=XUxenYHxS6NnyklTGrJYx4dbxFRx7k3ihSjKy1U3HA0QWEonLnL6zow0JJGkZzE3P4DICGihjrZ6vDuB3RntogPecuTz6dus4igbqnyBe0o0PQ-88-z0bWEf3OCyc8aFUuIaS6vwaWyijFUtiOPcF2kZnxicRlZ8yJABdlaPPdQPMAL-wXeVmqypj3wvGiTfIvCIf8jvDbPpnDC7W3F1I7x5UwRD8ouu74uWS0WNvrI&state=GupLWfSXuyQvf5gh";
		// Pattern pattern = Pattern.compile("[?&]ssoToken=([^&]*)");
		// Matcher matcher = pattern.matcher(ssoToken2);
		// if (matcher.find()) {
		// String group = matcher.group(1);
		// System.out.println("group = " + group);
		// }

		String token = "XUxenYHxS6NnyklTGrJYx4dbxFRx7k3ihSjKy1U3HA0QWEonLnL6zow0JJGkZzE3P4DICGihjrZ6vDuB3RntogPecuTz6dus4igbqnyBe0o0PQ-88-z0bWEf3OCyc8aFUuIaS6vwaWyijFUtiOPcF2kZnxicRlZ8yJABdlaPPdQPMAL-wXeVmqypj3wvGiTfIvCIf8jvDbPpnDC7W3F1I7x5UwRD8ouu74uWS0WNvrI";
		String secretKey = "RjNSNHJWWVViYmpvMjVOLzZHSDltcjRNQ0I5VnZQNkU=";

		SsoToken ssoToken = CryptoUtils.decryptFromToken(token, secretKey, SsoToken.class);

		// Map<String, String> simplifiedMap = new HashMap<>();
		// simplifiedMap.put("code", ssoToken.getCode());
		// simplifiedMap.put("token", ssoToken.getToken());
		// simplifiedMap.put("domain", "http://192.168.5.21/");

		System.out.println(ssoToken.getUserId());
		System.out.println(ssoToken.getCode());
		System.out.println(ssoToken.getToken());
		System.out.println(ssoToken.getDomain());
		System.out.println(ssoToken.getExpiresIn());

		String jstringString = "{\"userId\":null,\"code\":\"FL-04147\",\"expiresIn\":82693,\"token\":\"1e1a36c3b7994394825f52763f1ff512\",\"domain\":\".fanglin.vip\"}";

		String decryptedJson = new String(jstringString.getBytes(), StandardCharsets.UTF_8);

		ObjectMapper objectMapper = new ObjectMapper();

		SsoToken token1 = objectMapper.readValue(decryptedJson, SsoToken.class);

		System.out.println(token1.getCode());

		// String ssoToken1 = encryptToToken(simplifiedMap, secretKey);

		// System.out.println("ssoToken1 = " + ssoToken1);

	}
}
