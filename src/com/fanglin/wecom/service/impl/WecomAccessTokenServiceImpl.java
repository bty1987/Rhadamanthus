/**
 * @File Name		: WecomAccessTokenServiceImpl.java
 * @Package   	: com.fanglin.wecom.service.impl
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信 access_token 服务实现
 */

package com.fanglin.wecom.service.impl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.LogUtils;
import com.fanglin.wecom.dao.WecomAccessTokenDao;
import com.fanglin.wecom.po.WecomAccessTokenPO;
import com.fanglin.wecom.service.WecomAccessTokenService;
import com.fanglin.wecom.utils.WecomApi;
import com.fanglin.wecom.vo.WecomAccessTokenVO;

@Service("wecomAccessTokenService")
@Transactional(readOnly = true)
public class WecomAccessTokenServiceImpl implements WecomAccessTokenService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	/** access_token 默认有效期(秒), 企业微信官方 7200 */
	private static final long ACCESS_TOKEN_EXPIRE_TIME = 7200;

	/** 提前刷新缓冲时间(秒), 避免临界点失效 */
	private static final long REFRESH_BUFFER_TIME = 300;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private WecomAccessTokenDao wecomAccessTokenDao;

	@Override
	public WecomAccessTokenVO queryAccessToken(String company) {

		WecomAccessTokenPO accessTokenPO = wecomAccessTokenDao.queryAccessToken(FormatUtil.decodeCompany(company));
		WecomAccessTokenVO accessTokenVO = new WecomAccessTokenVO();

		BeanUtil.copyProperties(accessTokenPO, accessTokenVO);

		return accessTokenVO;
	}

	@Override
	public int makeAccessToken(String company) {

		int $company = FormatUtil.decodeCompany(company);

		SystemConfigPO oapi = systemConfigDao.querySystemConfig("WECOM_OAPI_URL_STR");
		SystemConfigPO corpid = systemConfigDao.querySystemConfig("WECOM_CORPID_STR", $company);
		SystemConfigPO secret = systemConfigDao.querySystemConfig("WECOM_SECRET_STR", $company);

		if (corpid == null || secret == null || oapi == null) {
			logger.warn("WecomAccessToken makeAccessToken config missing. company={}", $company);
			return 1;
		}

		String url = String.format(WecomApi.WECOM_GET_TOKEN_STR, oapi.getValue(), corpid.getValue(), secret.getValue());

		JSONObject response = HttpHelper.httpGet(url);

		if (response != null && response.containsKey("access_token")) {

			// 刷新前清理同公司旧 token, 避免表无限膨胀
			wecomAccessTokenDao.deleteAccessTokenByCompany($company);

			WecomAccessTokenPO accessTokenPO = new WecomAccessTokenPO(response.getString("access_token"), response.getIntValue("expires_in"), new Date().getTime(), $company);

			wecomAccessTokenDao.save(accessTokenPO);

			logger.info("WecomAccessToken makeAccessToken success. company={}", $company);
		} else {
			LogUtils.logging(logger, url, response == null ? -1 : response.getIntValue("errcode"), response == null ? "response is null" : response.toJSONString());
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

		// 清理 2 小时之前的过期 token (修复钉钉模块同类清理传 currentTime 导致空集的 bug)
		wecomAccessTokenDao.deleteAccessToken(currentTime - ACCESS_TOKEN_EXPIRE_TIME * 1000L);

		return 0;
	}

	/**
	 * 获取未过期的 access_token, 过期则自动刷新 (供 WecomMessageService 调用)
	 * @param company 编码后的 company 字符串
	 * @return access_token, 失败返回空串
	 */
	@Override
	public String getAccessToken(String company) {

		try {
			WecomAccessTokenVO accessTokenVO = queryAccessToken(company);

			if (accessTokenVO != null && accessTokenVO.getOperateTime() != null) {
				long elapsedTime = (System.currentTimeMillis() - accessTokenVO.getOperateTime()) / 1000;

				if (elapsedTime < (ACCESS_TOKEN_EXPIRE_TIME - REFRESH_BUFFER_TIME)) {
					return accessTokenVO.getAccessToken();
				}
			}

			logger.info("WecomAccessToken expired or missing, refresh. company={}", company);
			int result = makeAccessToken(company);

			if (result == 0) {
				WecomAccessTokenVO newAccessTokenVO = queryAccessToken(company);
				if (newAccessTokenVO != null && newAccessTokenVO.getAccessToken() != null) {
					return newAccessTokenVO.getAccessToken();
				}
			} else {
				logger.error("WecomAccessToken makeAccessToken failed, code={}. company={}", result, company);
			}
		} catch (Exception e) {
			logger.error("WecomAccessToken getAccessToken error. company={}, err={}", company, e.getMessage(), e);
		}

		return "";
	}

}
