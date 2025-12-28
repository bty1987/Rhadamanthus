package com.fanglin.dingding.service.impl;

import com.fanglin.dingding.po.DingTalkAccessTokenPO;
import com.fanglin.dingding.po.DingTalkJsapiTicketPO;
import com.fanglin.dingding.service.AuthService;
import com.fanglin.dingding.service.DingTalkAccessTokenService;
import com.fanglin.dingding.service.DingTalkJsapiTicketService;
import com.fanglin.dingding.utils.DDApi;
import com.fanglin.dingding.vo.DingTalkAccessTokenVO;
import com.fanglin.dingding.vo.DingTalkJsapiTicketVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.security.MessageDigest;
import java.util.Formatter;

@Service("authDDService")
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

	public static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DingTalkAccessTokenService accessTokenService;

	@Autowired
	private DingTalkJsapiTicketService jsapiTicketService;

	/**
	 * AccessToken 有效期（秒）
	 */
	private static final long ACCESS_TOKEN_EXPIRE_TIME = 7200; // 2小时

	/**
	 * JsapiTicket 有效期（秒）
	 */
	private static final long JSAPI_TICKET_EXPIRE_TIME = 7200; // 2小时

	/**
	 * 提前刷新时间（秒）- 提前5分钟刷新，避免临界点
	 */
	private static final long REFRESH_BUFFER_TIME = 300; // 5分钟

	@Override
	public String getAccessToken(String company) {
		try {
			// 1. 先从本地查询
			DingTalkAccessTokenVO accessTokenVO = accessTokenService.queryAccessToken(company);

			// 2. 判断是否存在且未过期
			if (accessTokenVO != null && accessTokenVO.getOperateTime() != null) {
				long currentTime = System.currentTimeMillis();
				long operateTime = accessTokenVO.getOperateTime();
				long elapsedTime = (currentTime - operateTime) / 1000; // 转换为秒

				// 如果还有效（剩余时间超过缓冲时间），直接返回
				if (elapsedTime < (ACCESS_TOKEN_EXPIRE_TIME - REFRESH_BUFFER_TIME)) {
					return accessTokenVO.getAccesstoken();
				}
			}

			// 3. 不存在或即将过期，自动生成新的
			logger.info("AccessToken 不存在或即将过期，自动生成新的。company={}", company);
			int result = accessTokenService.makeAccessToken(company);

			if (result == 0) {
				// 生成成功，重新查询并返回
				DingTalkAccessTokenVO newAccessTokenVO = accessTokenService.queryAccessToken(company);
				if (newAccessTokenVO != null && newAccessTokenVO.getAccesstoken() != null) {
					logger.info("AccessToken 自动生成成功。company={}", company);
					return newAccessTokenVO.getAccesstoken();
				} else {
					logger.error("AccessToken 自动生成失败，查询结果为空。company={}", company);
				}
			} else {
				logger.error("AccessToken 自动生成失败，makeAccessToken 返回错误码：{}。company={}", result, company);
			}

			return "";
		} catch (Exception e) {
			logger.error("获取 AccessToken 异常。company={}, error={}", company, e.getMessage(), e);
			return "";
		}
	}

	@Override
	public String getJsapiTicket(String company) {
		try {
			// 1. 先从本地查询
			DingTalkJsapiTicketVO jsapiTicketVO = jsapiTicketService.queryJsapiTicket(company);

			// 2. 判断是否存在且未过期
			if (jsapiTicketVO != null && jsapiTicketVO.getOperateTime() != null) {
				long currentTime = System.currentTimeMillis();
				long operateTime = jsapiTicketVO.getOperateTime();
				long elapsedTime = (currentTime - operateTime) / 1000; // 转换为秒

				// 如果还有效（剩余时间超过缓冲时间），直接返回
				if (elapsedTime < (JSAPI_TICKET_EXPIRE_TIME - REFRESH_BUFFER_TIME)) {
					return jsapiTicketVO.getJsapi();
				}
			}

			// 3. 不存在或即将过期，通过生成 AccessToken 来同时生成 JsapiTicket
			logger.info("JsapiTicket 不存在或即将过期，通过生成 AccessToken 来同时生成。company={}", company);
			int result = accessTokenService.makeAccessToken(company);

			if (result == 0) {
				// 生成成功，重新查询并返回
				DingTalkJsapiTicketVO newJsapiTicketVO = jsapiTicketService.queryJsapiTicket(company);
				if (newJsapiTicketVO != null && newJsapiTicketVO.getJsapi() != null) {
					logger.info("JsapiTicket 自动生成成功。company={}", company);
					return newJsapiTicketVO.getJsapi();
				} else {
					logger.error("JsapiTicket 自动生成失败，查询结果为空。company={}", company);
				}
			} else {
				logger.error("JsapiTicket 自动生成失败，makeAccessToken 返回错误码：{}。company={}", result, company);
			}

			return "";
		} catch (Exception e) {
			logger.error("获取 JsapiTicket 异常。company={}, error={}", company, e.getMessage(), e);
			return "";
		}
	}

	@Override
	public String sign(String ticket, String nonceStr, long timeStamp, String url) {

		String signInfo = "";
		String plain = String.format(DDApi.DDAPI_SIGN_STR, ticket, nonceStr, String.valueOf(timeStamp), url);

		try {
			MessageDigest sha1 = MessageDigest.getInstance("SHA-1");

			sha1.reset();
			sha1.update(plain.getBytes("UTF-8"));

			signInfo = bytesToHex(sha1.digest());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}

		return signInfo;
	}

	@Override
	public String bytesToHex(byte[] hash) {
		Formatter formatter = new Formatter();
		for (byte b : hash) {
			formatter.format("%02x", b);
		}
		String result = formatter.toString();
		formatter.close();
		return result;
	}

	@Override
	@SuppressWarnings("deprecation")
	public String getConfig(String urlString, String queryString, String company) {

		String url;
		String queryStringEncode = null;

		if (queryString != null) {
			queryStringEncode = URLDecoder.decode(queryString);
			url = urlString + "?" + queryStringEncode;
		} else {
			url = urlString;
		}

		String nonceStr = "abcdefg";
		long timeStamp = System.currentTimeMillis() / 1000;
		String signedUrl = url;
		String ticket = null;
		String signature = null;

		try {
			ticket = getJsapiTicket(company);
			signature = sign(ticket, nonceStr, timeStamp, signedUrl);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}

		SystemConfigPO corpId = systemConfigDao.querySystemConfig("corpId", FormatUtil.decodeCompany(company));

		return "({signature:'" + signature + "',nonceStr:'" + nonceStr + "',timeStamp:'" + timeStamp + "',corpId:'" + corpId.getValue() + "'})";
	}

}
