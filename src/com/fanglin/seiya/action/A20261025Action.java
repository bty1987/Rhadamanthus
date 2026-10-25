/**
 * @File Name		: A20261025Action.java
 * @Package   	: com.fanglin.seiya.action
 * @Version		: 1.0
 * @Date			: 2026-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: NERP签约/款项同步
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
import com.fanglin.seiya.service.A20261025Service;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20261025Action extends BaseListAction {

	private static final long serialVersionUID = 20261025L;

	@Autowired
	private A20261025Service a20261025Service;

	// ==================== 请求参数 ====================

	/** 装修单号 */
	private String orderId;

	/** 提交额/签单总额, 单位:分（款项接口必填, >0） */
	private Long money;

	/** 成本额, 单位:分（款项接口可选, 缺省0, >0 且公司配置时补成本利润款项） */
	private Long cost;

	/** 款项比例方案ID（款项接口必填, data.paymentscale） */
	private Long psid;

	/** 报价单名称（签约接口可选, 缺省"报价单"） */
	private String quotationName;

	/** 报价版本ID（签约接口可选, >0 校验存在; 缺省按公司默认版本解析） */
	private Long qvid;

	/** 签单额, 单位:分（签约接口可选, 写报价单总价与装修单 orderTotalPrice） */
	private Long totalPrice;

	/** 折扣, 万分比 10000=不打折（签约接口可选, 缺省10000） */
	private Integer discount;

	// ==================== 响应字段 ====================

	/**
	 * 返回字段 - data对象，封装处理结果
	 */
	private Map<String, Object> data;

	/**
	 * NERP凭空签约接口
	 *
	 * 匹配 signDecorationContract: 订单无默认报价时凭空创建一条无明细报价单并锁单,
	 * 装修单推进签约状态(3), 归属提成挂账, 签约消息队列与页面签约同路
	 * 相对原版放宽: 不要求已有款项交付/工程信息
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncSignContractForNerp", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,uid,data.*" }) }, params = { "contentType", "text/html" })
	public String syncSignContractForNerp() throws FLException {

		// 参数必填验证
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(400013, "装修单号不能为空");
		}

		String userId = querySyncUserId();

		if (userId == null || userId.trim().isEmpty()) {
			throw new FLException(400040, "操作账号无效");
		}

		// 调用服务层处理
		Map<String, Object> result = a20261025Service.syncSignContractForNerp(orderId.trim(), quotationName, qvid, totalPrice, discount, userId);

		// 设置响应数据
		this.data = result;

		return SUCCESS;
	}

	/**
	 * NERP凭空款项计划接口
	 *
	 * 匹配 makeDecorationPayment: 按款项比例方案(psid)将提交额(money)拆分为若干未收装修款项,
	 * 支撑后续在 ERP 走正常收款动作
	 * 相对原版放宽: 跳过活动物品核销与优惠抵扣
	 *
	 * @return SUCCESS
	 * @throws FLException 业务异常
	 */
	@Action(value = "syncDecorationPaymentForNerp", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "includeProperties", "errorCode,errorMsg,uid,data.*" }) }, params = { "contentType", "text/html" })
	public String syncDecorationPaymentForNerp() throws FLException {

		// 参数必填验证
		if (orderId == null || orderId.trim().isEmpty()) {
			throw new FLException(400013, "装修单号不能为空");
		}

		String userId = querySyncUserId();

		if (userId == null || userId.trim().isEmpty()) {
			throw new FLException(400040, "操作账号无效");
		}

		// 调用服务层处理
		Map<String, Object> result = a20261025Service.syncDecorationPaymentForNerp(orderId.trim(), money, cost, psid, userId);

		// 设置响应数据
		this.data = result;

		return SUCCESS;
	}

	/**
	 * 取同步操作账号
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

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	public Long getCost() {
		return cost;
	}

	public void setCost(Long cost) {
		this.cost = cost;
	}

	public Long getPsid() {
		return psid;
	}

	public void setPsid(Long psid) {
		this.psid = psid;
	}

	public String getQuotationName() {
		return quotationName;
	}

	public void setQuotationName(String quotationName) {
		this.quotationName = quotationName;
	}

	public Long getQvid() {
		return qvid;
	}

	public void setQvid(Long qvid) {
		this.qvid = qvid;
	}

	public Long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Long totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

}
