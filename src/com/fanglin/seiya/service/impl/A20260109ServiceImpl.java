/**
 * @File Name		: A20260109ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-01-09
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: ERP事件发布
 */

package com.fanglin.seiya.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.seiya.service.A20260109Service;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

@Service("A20260109Service")
@Transactional(readOnly = true)
public class A20260109ServiceImpl implements A20260109Service {

	private static final Logger logger = LoggerFactory.getLogger(A20260109ServiceImpl.class);

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public JSONObject publishErpEvent(String eventType, String orderId) throws FLException {
		return publishErpEvent(eventType, orderId, null, null);
	}

	@Override
	public JSONObject publishErpEvent(String eventType, String orderId, Long cnid, Integer userId) throws FLException {

		// 权限配置检查
		SystemConfigPO pmurl = systemConfigDao.querySystemConfig("PM_URL_STR");

		if (pmurl == null) {
			logger.warn("ERP事件发布功能未启用: PM_URL_STR配置不存在");
			return null;
		}

		try {

			String url = pmurl.getValue();

			JSONObject params = new JSONObject();

			params.put("eventType", eventType);

			params.put("orderId", orderId);

			params.put("cnid", cnid);

			params.put("userId", userId);

			logger.info("发布ERP事件: url={}, eventType={}, orderId={}, cnid={}, userId={}", url, eventType, orderId, cnid, userId);

			JSONObject response = com.fanglin.utils.HttpUtil.httpPost(url, params);

			logger.info("ERP事件响应: {}", response);

			if (response == null) {
				throw new FLException(110033, "ERP事件发布失败: 响应为空");
			}

			Integer code = response.getInteger("code");

			if (code == null || code != 200) {
				throw new FLException(110000, "ERP事件发布失败: " + response.getString("message"));
			}

			return response;

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			logger.error("ERP事件发布异常: eventType={}, orderId={}, cnid={}, userId={}", eventType, orderId, cnid, userId, e);
			throw new FLException(110000, "系统繁忙,请稍后重试");
		}
	}

}
