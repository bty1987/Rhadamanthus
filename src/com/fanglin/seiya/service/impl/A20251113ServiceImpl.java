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

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.util.EntityUtils;
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
			throw new FLException(110000, "系统繁忙,请稍后重试");
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

			return buildAuthentication(userPO);

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("交换授权码失败", e);
			throw new FLException(110000, "系统繁忙,请稍后重试");
		}
	}

	@Override
	public String exchangeAuthCodeForToken(String accessToken) throws FLException {

		try {

			// 1. accessToken 必填
			if (accessToken == null || accessToken.trim().isEmpty()) {
				throw new FLException(110000, "系统繁忙,请稍后重试");
			}

			// 2. 携带 accessToken 调 SSO 平台 get-permission-info, 由平台校验令牌并返回当前用户(含工号/手机号)
			SystemConfigPO ssourl = systemConfigDao.querySystemConfig("SSO_URL_STR");

			String url = String.format("%s/admin-api/user/auth/get-permission-info", ssourl.getValue());

			JSONObject response = httpGetForAuthorization(url, accessToken.trim());

			if (response == null || response.getIntValue("code") != 0) {
				logger.error(String.format("交换平台令牌失败, 平台响应异常: %s", response));
				throw new FLException(110000, "系统繁忙,请稍后重试");
			}

			JSONObject data = response.getJSONObject("data");

			// 3. 工号定位 ERP 用户, 手机号兜底
			UserPO userPO = null;

			if (data != null && data.getString("code") != null && !data.getString("code").trim().isEmpty()) {
				userPO = userDao.queryUserByUserId(data.getString("code").trim());
			}

			if (userPO == null && data != null && data.getString("phone") != null) {
				List<UserPO> userPOs = userDao.queryUserByPhoneAIdent(data.getString("phone"), "-1");
				if (userPOs != null && !userPOs.isEmpty()) {
					userPO = userPOs.get(0);
				}
			}

			if (userPO == null || userPO.getStatus() != UserPO.STATUS_ONJOB_INT) {
				throw new FLException(110004, "该用户不能登陆系统");
			}

			// 4. 签发 ERP 会话票据
			return buildAuthentication(userPO);

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("交换平台令牌失败", e);
			throw new FLException(110000, "系统繁忙,请稍后重试");
		}
	}

	// 按用户信息签发 ERP 会话票据(AES 密文), 供各授权码换票路径复用
	private String buildAuthentication(UserPO userPO) throws FLException {

		Authentication authentication = new Authentication(userPO.getUserId(), userPO.getCurrentName(), userPO.getRole().getRid(), (new Date()).getTime(), true, userPO.getCompany(), userPO.getFreedom());

		authentication.setCompany(userPO.getCompany());

		return AESHelper.encrypt(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));
	}

	// 带 Authorization 头的 GET(服务端调 SSO 平台), 非 200 或异常返回 null 由调用方统一处理
	private JSONObject httpGetForAuthorization(String url, String accessToken) {

		HttpGet httpGet = new HttpGet(url);

		httpGet.setHeader("Authorization", String.format("Bearer %s", accessToken));

		CloseableHttpClient httpClient = HttpClients.createDefault();

		RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000).build();

		httpGet.setConfig(requestConfig);

		CloseableHttpResponse response = null;

		try {

			response = httpClient.execute(httpGet, new BasicHttpContext());

			if (response.getStatusLine().getStatusCode() != 200) {
				logger.error(String.format("SSO平台请求失败, http code=%d, url=%s", response.getStatusLine().getStatusCode(), url));
				return null;
			}

			HttpEntity entity = response.getEntity();

			if (entity != null) {
				return JSONObject.parseObject(EntityUtils.toString(entity, "utf-8"));
			}

		} catch (Exception e) {
			logger.error(String.format("SSO平台请求异常, url=%s, msg=%s", url, e.getMessage()));
		} finally {
			if (response != null) {
				try {
					response.close();
				} catch (IOException e) {
					logger.error(String.format("SSO平台请求关闭异常, url=%s, msg=%s", url, e.getMessage()));
				}
			}
		}

		return null;
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
			throw new FLException(110000, "系统繁忙,请稍后重试");
		}

		JSONObject data = response.getJSONObject("data");
		if (data == null || data.getString("phone") == null) {
			throw new FLException(110032, "SSO登录失败，未获取到用户手机号");
		}

		List<UserPO> userPOs = userDao.queryUserByPhoneAIdent(data.getString("phone"), "-1");

		if (userPOs != null && userPOs.size() != 0) {

			UserPO userPO = userPOs.get(0);

			return buildAuthentication(userPO);
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
			throw new FLException(110000, "系统繁忙,请稍后重试");
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
