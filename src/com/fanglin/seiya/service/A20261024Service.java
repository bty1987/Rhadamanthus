/**
 * @File Name		: A20261024Service.java
 * @Package   	: com.fanglin.seiya.service
 * @Version		: 1.0
 * @Date			: 2026-10-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: NERP预签同步服务接口
 */

package com.fanglin.seiya.service;

import java.util.Map;

import com.fanglin.core.interceptor.FLException;

public interface A20261024Service {

	/**
	 * NERP凭空预签
	 *
	 * 复刻 decoration 预签接口(presignDecorationContract)语义, 供 NERP 侧直接触发预签:
	 * 不依赖 ERP 预签报价流程, 凭空创建一张无明细的锁定预签单(protation), 并将装修单推进到预签状态
	 *
	 * 仅允许初始(0)/定金(1)状态装修单操作; 订单已存在默认预签单时拒绝(400044), 不覆盖既有报价数据
	 *
	 * @param orderId 装修单号
	 * @param name 预签单名称（可选, 缺省"预签单"）
	 * @param price 预签金额, 单位:分（可选, 缺省0, 写入 protation.totalPrice 与装修单 precontractPrice）
	 * @param userId 操作账号（预签单创建人/操作记录操作人）
	 * @return 包含 operation, orderId, pid, precontractPrice 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncProsignForNerp(String orderId, String name, Long price, String userId) throws FLException;

}
