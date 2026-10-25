/**
 * @File Name		: A20261025Action.java
 * @Package   	: com.fanglin.seiya.action
 * @Version		: 1.0
 * @Date			: 2026-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: NERP预签/签约/款项同步
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
import com.fanglin.quotation.vo.ProtationVO;
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

	/** 预签单名称（预签接口可选, 缺省"预签单"） */
	private String name;

	/** 预签产品ID（预签接口可选, >0 时校验存在） */
	private Long ppid;

	/** 报价版本ID（预签/签约接口可选, >0 时校验存在; 签约缺省按公司默认版本解析） */
	private Long qvid;

	/** 产品名称（预签接口可选） */
	private String product;

	/** 备注（预签接口可选） */
	private String comment;

	/** 总价/预签合同额, 单位:分（预签接口可选, 缺省0, 同时写装修单预签合同额; 签约接口可选, 写报价单总价与装修单 orderTotalPrice） */
	private Long totalPrice;

	/** 起报价, 单位:分（预签接口可选, 缺省=totalPrice） */
	private Long quotePrice;

	/** 面积, 单位:平米×1000（预签接口可选, 如116000=116平米） */
	private Integer quoteArea;

	/** 计价单价, 单位:分（预签接口可选） */
	private Long unitPrice;

	/** 成本价, 单位:分（预签接口可选） */
	private Long costPrice;

	/** 利润率（预签接口可选, 按ERP页面口径） */
	private Integer profitRate;

	/** 基础额, 单位:分（预签接口可选） */
	private Long basicPrice;

	/** 工程额, 单位:分（预签接口可选） */
	private Long comdPrice;

	/** 主材额, 单位:分（预签接口可选） */
	private Long commPrice;

	/** 增工额, 单位:分（预签接口可选） */
	private Long adddPrice;

	/** 增主额, 单位:分（预签接口可选） */
	private Long addmPrice;

	/** 减工额, 单位:分（预签接口可选） */
	private Long subdPrice;

	/** 减主额, 单位:分（预签接口可选） */
	private Long submPrice;

	/** 预签项差额, 单位:分（预签接口可选） */
	private Long subcPrice;

	/** 附加设计额, 单位:分（预签接口可选） */
	private Long accdPrice;

	/** 附加管理额, 单位:分（预签接口可选） */
	private Long accmPrice;

	/** 主材成本, 单位:分（预签接口可选） */
	private Long mostPrice;

	/** 工程增项成本比例（预签接口可选, 按ERP页面口径） */
	private Integer costRate;

	/** 主材增项成本比例（预签接口可选, 按ERP页面口径） */
	private Integer mostRate;

	/** 成本总额, 单位:分（预签接口可选） */
	private Long totalCost;

	/** 利润总额, 单位:分（预签接口可选） */
	private Long totalProfit;

	/** 折扣, 万分比, 10000=不打折（预签接口可选, 如7500=75折; 签约接口可选, 缺省10000） */
	private Integer discount;

	/** 管理费比例（预签接口可选, 按ERP页面口径） */
	private Integer manageRate;

	/** 管理费公式（预签接口可选） */
	private String manageFormula;

	/** 管理折扣（预签接口可选, 按ERP页面口径） */
	private Integer manageDiscount;

	/** 管理费, 单位:分（预签接口可选） */
	private Long managePrice;

	/** 税金比例（预签接口可选, 按ERP页面口径） */
	private Integer taxRate;

	/** 税金公式（预签接口可选） */
	private String taxFormula;

	/** 税金, 单位:分（预签接口可选） */
	private Long taxPrice;

	/** 优惠价, 单位:分（预签接口可选） */
	private Long preferPrice;

	/** 浮动额, 单位:分（预签接口可选, 预签优惠审批上限即此值） */
	private Long activityPrice;

	/** 活动优惠, 单位:分（预签接口可选） */
	private Long activityProfit;

	/** 管理利润, 单位:分（预签接口可选） */
	private Long manageProfit;

	/** 预收利润, 单位:分（预签接口可选） */
	private Long advanceProfit;

	/** 提交额/签单总额, 单位:分（款项接口必填, >0） */
	private Long money;

	/** 成本额, 单位:分（款项接口可选, 缺省0, >0 且公司配置时补成本利润款项） */
	private Long cost;

	/** 款项比例方案ID（款项接口必填, data.paymentscale） */
	private Long psid;

	/** 报价单名称（签约接口可选, 缺省"报价单"） */
	private String quotationName;

	// ==================== 响应字段 ====================

	/**
	 * 返回字段 - data对象，封装处理结果
	 */
	private Map<String, Object> data;

	/**
	 * NERP凭空预签接口
	 *
	 * 不依赖 ERP 预签报价流程: 凭空创建一张无明细的锁定预签单(protation, 金额/面积/版本等字段按入参回填),
	 * 并将装修单推进到预签状态
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

		// 平铺参数装入预签单VO载体
		ProtationVO protation = new ProtationVO();

		protation.setPpid(ppid);
		protation.setName(name);
		protation.setProduct(product);
		protation.setComment(comment);
		protation.setTotalPrice(totalPrice);
		protation.setQuotePrice(quotePrice);
		protation.setQuoteArea(quoteArea);
		protation.setUnitPrice(unitPrice);
		protation.setCostPrice(costPrice);
		protation.setProfitRate(profitRate);
		protation.setBasicPrice(basicPrice);
		protation.setComdPrice(comdPrice);
		protation.setCommPrice(commPrice);
		protation.setAdddPrice(adddPrice);
		protation.setAddmPrice(addmPrice);
		protation.setSubdPrice(subdPrice);
		protation.setSubmPrice(submPrice);
		protation.setSubcPrice(subcPrice);
		protation.setAccdPrice(accdPrice);
		protation.setAccmPrice(accmPrice);
		protation.setMostPrice(mostPrice);
		protation.setCostRate(costRate);
		protation.setMostRate(mostRate);
		protation.setTotalCost(totalCost);
		protation.setTotalProfit(totalProfit);
		protation.setDiscount(discount);
		protation.setManageRate(manageRate);
		protation.setManageFormula(manageFormula);
		protation.setManageDiscount(manageDiscount);
		protation.setManagePrice(managePrice);
		protation.setTaxRate(taxRate);
		protation.setTaxFormula(taxFormula);
		protation.setTaxPrice(taxPrice);
		protation.setPreferPrice(preferPrice);
		protation.setActivityPrice(activityPrice);
		protation.setActivityProfit(activityProfit);
		protation.setManageProfit(manageProfit);
		protation.setAdvanceProfit(advanceProfit);

		// 调用服务层处理
		Map<String, Object> result = a20261025Service.syncProsignForNerp(orderId.trim(), protation, qvid, userId);

		// 设置响应数据
		this.data = result;

		return SUCCESS;
	}

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public Long getQvid() {
		return qvid;
	}

	public void setQvid(Long qvid) {
		this.qvid = qvid;
	}

	public String getProduct() {
		return product;
	}

	public void setProduct(String product) {
		this.product = product;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Long totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Long getQuotePrice() {
		return quotePrice;
	}

	public void setQuotePrice(Long quotePrice) {
		this.quotePrice = quotePrice;
	}

	public Integer getQuoteArea() {
		return quoteArea;
	}

	public void setQuoteArea(Integer quoteArea) {
		this.quoteArea = quoteArea;
	}

	public Long getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Long unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Long costPrice) {
		this.costPrice = costPrice;
	}

	public Integer getProfitRate() {
		return profitRate;
	}

	public void setProfitRate(Integer profitRate) {
		this.profitRate = profitRate;
	}

	public Long getBasicPrice() {
		return basicPrice;
	}

	public void setBasicPrice(Long basicPrice) {
		this.basicPrice = basicPrice;
	}

	public Long getComdPrice() {
		return comdPrice;
	}

	public void setComdPrice(Long comdPrice) {
		this.comdPrice = comdPrice;
	}

	public Long getCommPrice() {
		return commPrice;
	}

	public void setCommPrice(Long commPrice) {
		this.commPrice = commPrice;
	}

	public Long getAdddPrice() {
		return adddPrice;
	}

	public void setAdddPrice(Long adddPrice) {
		this.adddPrice = adddPrice;
	}

	public Long getAddmPrice() {
		return addmPrice;
	}

	public void setAddmPrice(Long addmPrice) {
		this.addmPrice = addmPrice;
	}

	public Long getSubdPrice() {
		return subdPrice;
	}

	public void setSubdPrice(Long subdPrice) {
		this.subdPrice = subdPrice;
	}

	public Long getSubmPrice() {
		return submPrice;
	}

	public void setSubmPrice(Long submPrice) {
		this.submPrice = submPrice;
	}

	public Long getSubcPrice() {
		return subcPrice;
	}

	public void setSubcPrice(Long subcPrice) {
		this.subcPrice = subcPrice;
	}

	public Long getAccdPrice() {
		return accdPrice;
	}

	public void setAccdPrice(Long accdPrice) {
		this.accdPrice = accdPrice;
	}

	public Long getAccmPrice() {
		return accmPrice;
	}

	public void setAccmPrice(Long accmPrice) {
		this.accmPrice = accmPrice;
	}

	public Long getMostPrice() {
		return mostPrice;
	}

	public void setMostPrice(Long mostPrice) {
		this.mostPrice = mostPrice;
	}

	public Integer getCostRate() {
		return costRate;
	}

	public void setCostRate(Integer costRate) {
		this.costRate = costRate;
	}

	public Integer getMostRate() {
		return mostRate;
	}

	public void setMostRate(Integer mostRate) {
		this.mostRate = mostRate;
	}

	public Long getTotalCost() {
		return totalCost;
	}

	public void setTotalCost(Long totalCost) {
		this.totalCost = totalCost;
	}

	public Long getTotalProfit() {
		return totalProfit;
	}

	public void setTotalProfit(Long totalProfit) {
		this.totalProfit = totalProfit;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getManageRate() {
		return manageRate;
	}

	public void setManageRate(Integer manageRate) {
		this.manageRate = manageRate;
	}

	public String getManageFormula() {
		return manageFormula;
	}

	public void setManageFormula(String manageFormula) {
		this.manageFormula = manageFormula;
	}

	public Integer getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(Integer manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	public Long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Long managePrice) {
		this.managePrice = managePrice;
	}

	public Integer getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(Integer taxRate) {
		this.taxRate = taxRate;
	}

	public String getTaxFormula() {
		return taxFormula;
	}

	public void setTaxFormula(String taxFormula) {
		this.taxFormula = taxFormula;
	}

	public Long getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(Long taxPrice) {
		this.taxPrice = taxPrice;
	}

	public Long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(Long preferPrice) {
		this.preferPrice = preferPrice;
	}

	public Long getActivityPrice() {
		return activityPrice;
	}

	public void setActivityPrice(Long activityPrice) {
		this.activityPrice = activityPrice;
	}

	public Long getActivityProfit() {
		return activityProfit;
	}

	public void setActivityProfit(Long activityProfit) {
		this.activityProfit = activityProfit;
	}

	public Long getManageProfit() {
		return manageProfit;
	}

	public void setManageProfit(Long manageProfit) {
		this.manageProfit = manageProfit;
	}

	public Long getAdvanceProfit() {
		return advanceProfit;
	}

	public void setAdvanceProfit(Long advanceProfit) {
		this.advanceProfit = advanceProfit;
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

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

}
