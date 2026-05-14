/**
 * @File Name     : QuotationAssignTalkDao.java
 * @Package       : com.fanglin.quotation.dao
 * @Version       : 1.0
 * @Date          : 2026-04-30
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 报价分配沟通消息 DAO 接口
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationAssignTalkPO;

/**
 * 报价分配沟通消息 DAO 接口
 *
 * @author Claude AI
 * @version 1.0
 */
public interface QuotationAssignTalkDao extends Dao<QuotationAssignTalkPO> {

	/**
	 * 根据装修单号查询沟通消息列表（按发送时间升序）
	 *
	 * @param orderId 装修单号
	 * @return 消息列表
	 */
	List<QuotationAssignTalkPO> queryQuotationAssignTalkByOrderId(String orderId);

	/**
	 * 根据装修单号查询沟通消息列表，只返回当前用户作为发送人或接收人的消息
	 *
	 * @param orderId 装修单号
	 * @param uid 当前用户uid
	 * @return 消息列表
	 */
	List<QuotationAssignTalkPO> queryQuotationAssignTalkByOrderIdAndUserId(String orderId, int uid);
}
