/**
 * @File Name		: A20261025Service.java
 * @Package   	: com.fanglin.seiya.service
 * @Version		: 1.0
 * @Date			: 2026-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: NERP预签/签约/款项同步服务接口
 */

package com.fanglin.seiya.service;

import java.util.Map;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.ProtationVO;

public interface A20261025Service {

	/**
	 * NERP凭空预签
	 *
	 * 复刻 decoration 预签接口(presignDecorationContract)语义, 供 NERP 侧直接触发预签:
	 * 不依赖 ERP 预签报价流程, 凭空创建一张无明细的锁定预签单(protation, 金额/面积/版本等字段按入参回填),
	 * 并将装修单推进到预签状态
	 *
	 * 仅允许初始(0)/定金(1)状态装修单操作; 订单已存在默认预签单时拒绝(400044), 不覆盖既有报价数据;
	 * ppid>0 校验预签产品存在(130080), qvid>0 校验报价版本存在(200050)
	 *
	 * @param orderId 装修单号
	 * @param protation 预签单VO载体（未传字段保持PO缺省值0; totalPrice 兼驱动装修单预签合同额; quotePrice 缺省取 totalPrice）
	 * @param qvid 报价版本ID（可选, >0 时校验存在并挂接）
	 * @param userId 操作账号（预签单创建人/操作记录操作人）
	 * @return 包含 operation, orderId, pid, precontractPrice 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncProsignForNerp(String orderId, ProtationVO protation, Long qvid, String userId) throws FLException;

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

	/**
	 * NERP销售款项同步（补全单据语义）
	 *
	 * 兼容 sales.sales / payment.salespayment: 目的是补全销售单据并生成待收/待退款项, 收款/退款动作在 ERP 走正常流程
	 * (collectSalesPayment/refundsSalesPayment 承接收据/渠道/状态推进/销售比例重算):
	 * 判断补充式——按 sales.comment='NERP:{salesNo}' 查重, 销售单不存在时凭空创建(照 addSales 口径, no 走 counting 52 号,
	 * house/customer/dept/region 从装修单带出, 四人员 supplier/salesman/instorer/guider 必传), 存在时复用;
	 * 款项按 销售单(NERP锚)+type+referMoney+待收态 组合查重防重推, 落 salespayment(status=INIT 待收/待退):
	 * type=2 定金 / 3 补款 → 待收款项行; type=4 退款 → 待退款项行 + 凭空生成 salesRefunds
	 * (照审批物化口径, comment 嵌 NERP 款项单号, spid 回填, 待退态)并关联款项
	 *
	 * @param orderId 装修单号
	 * @param salesNo NERP销售单号（幂等锚, 嵌 sales.comment）
	 * @param paymentNo NERP款项单号（留痕, 嵌 salesRefunds.comment; 幂等按组合查重）
	 * @param type 款项类型: 2 定金 / 3 补款 / 4 退款
	 * @param money 金额, 单位:分（>0）
	 * @param bid 品牌ID（凭空建销售单时必填, 品类由品牌带出）
	 * @param supplierUid 厂商工号（凭空建单时必传）
	 * @param salesmanUid 销售员工号（凭空建单时必传）
	 * @param instorerUid 驻店员工号（凭空建单时必传）
	 * @param guiderUid 导购工号（凭空建单时必传）
	 * @param salesAmount 销售单商品总额, 单位:分（可选, 凭空建单时缺省取首笔 money; 复用已有单不修改）
	 * @param userId 操作账号（创建人）
	 * @return 包含 operation, sid, no, spid, rid(退款时), orderId, type, money 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncSalesPaymentForNerp(String orderId, String salesNo, String paymentNo, Short type, Long money, Long bid, String supplierUid, String salesmanUid, String instorerUid, String guiderUid, Long salesAmount, String userId) throws FLException;

	/**
	 * NERP增减款同步
	 *
	 * 兼容 quotation.addreduce / payment.decorationpayment: 判断补充式——按 orderId+content 精等查重
	 * (content 嵌 'NERP:{arNo} ' 前缀作幂等锚, NERP 重试报文一致即命中), 增减单不存在时经 addAddReduce 凭空创建
	 * (STATUS_UNSUBMIT, total=money), 已存在时复用; 再走 submitAddReduce 提交链落 decorationpayment
	 * (paymentType=增项款/减项款, twoType=增减款, referMoney 取整千元, dpId 回写, normchanerecord 埋点),
	 * payment 数据由增减单提交动作产生, 不裸落
	 *
	 * @param orderId 装修单号
	 * @param arNo NERP增减单号（幂等锚, 嵌 content 前缀）
	 * @param type 增减类型: 0 增项 / 1 减项（2 漏项不开放）
	 * @param money 金额, 单位:分（>0, 落款项时按原版口径取整千元）
	 * @param content 增减明细说明（必填, NERP 原文, 接口拼 NERP 单号前缀后落库; 含前缀总长不得超 256 字符）
	 * @param userId 操作账号（增减单创建人/提交人）
	 * @return 包含 operation, arId, dpId, orderId, type, money, paymentMoney(实际落库款项金额) 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncAddreduceForNerp(String orderId, String arNo, Short type, Long money, String content, String userId) throws FLException;

}
