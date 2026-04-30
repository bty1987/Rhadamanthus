/**
 * @File Name     : QuotationAssignTalkService.java
 * @Package       : com.fanglin.quotation.service
 * @Version       : 1.0
 * @Date          : 2026-04-30
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 报价分配沟通消息 Service 接口
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationAssignTalkVO;

/**
 * 报价分配沟通消息 Service 接口
 *
 * <p>
 * 职责：处理设计师和预算员之间针对某个装修单分配请求的沟通消息
 * </p>
 *
 * @author Claude AI
 * @version 1.0
 */
public interface QuotationAssignTalkService {

	/**
	 * 根据装修单号查询沟通消息列表
	 *
	 * @param orderId 装修单号
	 * @return 沟通消息列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignTalkVO> queryQuotationAssignTalkByOrderId(String orderId) throws FLException;

	/**
	 * 发送沟通消息
	 *
	 * <p>
	 * 保存消息到数据库，并根据发送人角色自动确定接收人发送钉钉通知
	 * </p>
	 *
	 * @param quotationAssignTalkVO 沟通消息VO（含orderId、content）
	 * @param senderUserId 发送人userId（从Action层当前登录用户获取）
	 * @return 保存后的完整消息VO
	 * @throws FLException 业务异常
	 */
	QuotationAssignTalkVO sendQuotationAssignTalk(QuotationAssignTalkVO quotationAssignTalkVO, String senderUserId) throws FLException;
}
