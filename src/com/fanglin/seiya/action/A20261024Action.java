/**
 * @File Name		: A20261024Action.java
 * @Package   	: com.fanglin.seiya.action
 * @Version		: 1.0
 * @Date			: 2026-10-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: NERP预签同步
 */

package com.fanglin.seiya.action;

import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.seiya.service.A20261024Service;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20261024Action extends BaseListAction {

	private static final long serialVersionUID = 20261024L;

	@Autowired
	private A20261024Service a20261024Service;

	// ==================== 请求参数 ====================

	/** 装修单号 */
	private String orderId;

	/** 预签单名称（可选, 缺省"预签单"） */
	private String name;

	/** 预签金额, 单位:分（可选, 缺省0） */
	private Long price;

	// ==================== 响应字段 ====================

	/**
	 * 返回字段 - data对象，封装处理结果
	 */
	private Map<String, Object> data;

	/**
	 * NERP凭空预签接口
	 *
	 * 不依赖 ERP 预签报价流程: 凭空创建一张无明细的锁定预签单(protation), 并将装修单推进到预签状态
	 * 仅允许初始(0)/定金(1)状态装修单操作; 订单已存在默认预签单时拒绝(400044)
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncProsignForNerp", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,uid,data.*" }) }, params = { "contentType", "text/html" })
	public String syncProsignForNerp() throws FLException {

		// 参数必填验证
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(400013, "装修单号不能为空");
		}

		String userId = querySyncUserId();

		if (userId == null || userId.trim().isEmpty()) {
			throw new FLException(400040, "操作账号无效");
		}

		// 调用服务层处理
		Map<String, Object> result = a20261024Service.syncProsignForNerp(orderId.trim(), name, price, userId);

		// 设置响应数据
		this.data = result;

		return SUCCESS;
	}

	/**
	 * 取预签同步操作账号
	 *
	 * queryUserId() 优先（认证串为完整登录态格式时可解出 userId）；
	 * 为 null 时按 AccessInterceptor through=2 语义将 authentication 解密明文视为 userId（认证串为纯账号加密串的场景）
	 */
	private String querySyncUserId() throws FLException {

		String userId = queryUserId();

		if (userId == null || userId.trim().isEmpty()) {

			String authentication = request.getParameter("authentication");

			if (authentication != null) {

				String decryptString = AESHelper.decrypt(authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

				if (decryptString != null && !decryptString.trim().isEmpty()) {
					userId = decryptString.trim();
				}
			}
		}

		return userId;
	}

	// ==================== Getter and Setter ====================

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getPrice() {
		return price;
	}

	public void setPrice(Long price) {
		this.price = price;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

}
