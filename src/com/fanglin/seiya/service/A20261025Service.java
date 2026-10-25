/**
 * @File Name		: A20261025Service.java
 * @Package   	: com.fanglin.seiya.service
 * @Version		: 1.0
 * @Date			: 2026-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: NERP签约/款项同步服务接口
 */

package com.fanglin.seiya.service;

import java.util.Map;

import com.fanglin.core.interceptor.FLException;

public interface A20261025Service {

	/**
	 * NERP凭空签约
	 *
	 * 匹配 decoration 签约接口(signDecorationContract)语义, 供 NERP 迁移单在 ERP 补齐业务流转:
	 * 订单无默认报价时凭空创建一条无明细的报价单(quotation)并锁单, 装修单推进到签约状态(3),
	 * 归属提成挂账(decorationoperate.sign.belong), 签约消息队列与页面签约同路
	 *
	 * 相对原版的凭空放宽: 不要求已有款项交付(140006), 不要求工程信息存在(120020/120032, 存在则回填初始设计时间)
	 *
	 * @param orderId 装修单号
	 * @param quotationName 报价单名称（可选, 缺省"报价单", 仅凭空建报价时生效）
	 * @param qvid 报价版本ID（可选, >0 校验存在; 缺省按公司默认版本解析）
	 * @param totalPrice 签单额, 单位:分（可选, 写报价单总价与装修单 orderTotalPrice）
	 * @param discount 折扣, 万分比 10000=不打折（可选, 缺省10000, 仅凭空建报价时生效）
	 * @param userId 操作账号（签约人/报价创建人/操作记录操作人）
	 * @return 包含 operation, orderId, qid, orderTotalPrice 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncSignContractForNerp(String orderId, String quotationName, Long qvid, Long totalPrice, Integer discount, String userId) throws FLException;

	/**
	 * NERP凭空款项计划
	 *
	 * 匹配款项生成接口(makeDecorationPayment)语义, 供 NERP 迁移单在 ERP 生成合同款项计划(未收),
	 * 支撑后续在 ERP 走正常收款动作: 按款项比例方案(psid)将提交额拆分为若干装修款项(decorationpayment)
	 *
	 * 相对原版的凭空放宽: 跳过活动物品核销与优惠抵扣(迁移单无活动), paymentMoney = 提交额取整
	 *
	 * @param orderId 装修单号
	 * @param money 提交额, 单位:分（写装修单 orderTotalPrice）
	 * @param cost 成本额, 单位:分（可选, 缺省0; >0 且公司配置 PAYMENT_TYPE_SUPROFIT_INT 时补一条成本利润款项）
	 * @param psid 款项比例方案ID（data.paymentscale, 方案须含比例项）
	 * @param userId 操作账号（款项创建人）
	 * @return 包含 operation, orderId, count, paymentMoney 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncDecorationPaymentForNerp(String orderId, Long money, Long cost, Long psid, String userId) throws FLException;

}
