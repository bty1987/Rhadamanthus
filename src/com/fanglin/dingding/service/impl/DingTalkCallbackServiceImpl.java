/**
 * @File Name		: DingTalkCallbackServiceImpl.java
 * @Package   	: com.fanglin.dingding.service.impl
 * @Version		: 3.0
 * @Date			: 2018-12-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 钉钉回调服务实现（v3: 反射调用，零业务引用，通用审批保留原逻辑）
 */

package com.fanglin.dingding.service.impl;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.dingtalk.oapi.lib.aes.DingTalkEncryptException;
import com.dingtalk.oapi.lib.aes.DingTalkEncryptor;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.dao.DingTalkApprovalConfigDao;
import com.fanglin.dingding.po.DingTalkApprovalConfigPO;
import com.fanglin.dingding.service.DingTalkApprovalService;
import com.fanglin.dingding.service.DingTalkCallbackService;
import com.fanglin.system.dao.SystemConfigDao;

@Service("dingTalkCallbackService")
@Transactional(readOnly = true)
public class DingTalkCallbackServiceImpl implements DingTalkCallbackService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DingTalkApprovalService dingTalkApprovalService;

	@Autowired
	private com.fanglin.approval.service.ApprovalService approvalService;

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private DingTalkApprovalConfigDao dingTalkApprovalConfigDao;

	@Autowired
	private ApplicationContext applicationContext;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, String> callback(String signature, String nonce, String timestamp, String encrypt) throws FLException {

		String suiteKey = systemConfigDao.querySystemConfig("suiteKey").value("");
		String encodingAesKey = systemConfigDao.querySystemConfig("encodingAesKey").value("");
		String token = systemConfigDao.querySystemConfig("token").value("fanglinserver");

		DingTalkEncryptor dingTalkEncryptor;
		String plainText;

		try {
			dingTalkEncryptor = new DingTalkEncryptor(token, encodingAesKey, suiteKey);
			plainText = dingTalkEncryptor.getDecryptMsg(signature, timestamp, nonce, encrypt);
		} catch (DingTalkEncryptException e) {
			System.out.println(e.getMessage());
			throw new FLException(270009, "回调解密失败");
		}

		JSONObject response = JSON.parseObject(plainText);

		if (response == null || !response.containsKey("EventType")) {
			System.out.println(plainText);
			throw new FLException(270009, "回调解密失败");
		}

		String event = response.getString("EventType");

		if ("check_url".equals(event)) {
			System.out.println(response.toJSONString());
		}

		if ("bpms_instance_change".equals(event)) {

			String userId = response.getString("staffId");
			String code = response.getString("processCode");
			String type = response.getString("type");
			String result = response.getString("result");
			String no = response.getString("processInstanceId");

			// ========== 专用审批：配置驱动 + 反射调用 ==========
			if ("finish".equals(type)) {
				DingTalkApprovalConfigPO config = dingTalkApprovalConfigDao.queryByProcessCode(code);

				if (config != null) {

					if (config.getHandleAgreeOnly().shortValue() == 1 && !"agree".equals(result)) {
						// handleAgreeOnly 且非agree，跳过
					} else {
						String orderId = dingTalkApprovalService.getApproval(no, config.getFieldId());

						System.out.println(response.toJSONString());
						System.out.println(orderId);

						invokeHandler(config, orderId, userId);
					}
				}
			}

			// ========== 通用审批：从配置表获取 codes ==========
			if ("finish".equals(type)) {
				List<String> codes = dingTalkApprovalConfigDao.queryEnabledGenericProcessCodes();

				if (codes.contains(code)) {

					ApprovalPO approvalPO = approvalDao.queryApprovalByProcessinstanceid(no);

					if (approvalPO != null) {

						System.out.println(response.toJSONString());
						System.out.println(approvalPO.getAid());

						approvalPO.setPiid(null);

						if ("agree".equals(result)) approvalService.approve(approvalPO);
						else approvalService.refuse(approvalPO);
					}
				}
			}
		}

		try {
			return dingTalkEncryptor.getEncryptedMap("success", new Date().getTime(), nonce);
		} catch (DingTalkEncryptException e) {
			System.out.println(e.getMessage());
			throw new FLException(270010, "回调加密失败");
		}
	}

	/**
	 * 反射调用配置的 Spring Bean 方法 约定方法签名: void methodName(XXXVo(orderId), String userId)
	 */
	private void invokeHandler(DingTalkApprovalConfigPO config, String orderId, String userId) throws FLException {

		try {
			// 按全限定类名从Spring容器获取Bean
			Class<?> beanClass = Class.forName(config.getBeanClass());
			Object bean = applicationContext.getBean(beanClass);

			// 构造VO参数
			Class<?> voClazz = Class.forName(config.getVoClass());
			Constructor<?> voConstructor = voClazz.getConstructor(String.class);
			Object voInstance = voConstructor.newInstance(orderId);

			// 反射调用方法
			Method method = beanClass.getMethod(config.getMethodName(), voClazz, String.class);
			method.invoke(bean, voInstance, userId);

		} catch (ClassNotFoundException e) {
			System.out.println(String.format("回调配置类未找到: %s", e.getMessage()));
			throw new FLException(270011, String.format("回调配置类未找到: %s", config.getBeanClass()));
		} catch (NoSuchMethodException e) {
			System.out.println(String.format("回调配置方法未找到: %s.%s", config.getBeanClass(), config.getMethodName()));
			throw new FLException(270012, String.format("回调配置方法未找到: %s.%s", config.getBeanClass(), config.getMethodName()));
		} catch (java.lang.reflect.InvocationTargetException e) {
			Throwable target = e.getTargetException();
			if (target instanceof FLException) throw (FLException) target;
			System.out.println(String.format("回调执行异常: %s", target.getMessage()));
			throw new FLException(270013, String.format("回调执行异常: %s", target.getMessage()));
		} catch (Exception e) {
			System.out.println(String.format("回调反射异常: %s", e.getMessage()));
			throw new FLException(270013, String.format("回调反射异常: %s", e.getMessage()));
		}
	}

}
