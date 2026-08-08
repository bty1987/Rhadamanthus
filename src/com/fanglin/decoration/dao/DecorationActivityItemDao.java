/**
 * @File Name		: DecorationActivityItemDao.java
 * @Package   	: com.fanglin.decoration.dao
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationActivityItemPO;

public interface DecorationActivityItemDao extends Dao<DecorationActivityItemPO> {

	public List<DecorationActivityItemPO> queryDecorationActivityItemByOrderId(String orderId);

	public List<DecorationActivityItemPO> queryDecorationActivityItemByOrderId(String orderId, short type, short status);

	public List<DecorationActivityItemPO> queryDecorationActivityItem(String orderId, String no);

	public long amountDecorationActivityItem(String orderId, short isPayment);

	public long amountDecorationActivityItem(String orderId, Short type, Short isPrefor, Short isPayment);

	public long amountDecorationActivityItem(String orderId, Short type, List<Short> states, Short isPrefor, Short isPayment);

	public long pointDecorationActivityItem(String orderId);

	/**
	 * 统计活动项目数量（使用 COUNT(*)）
	 * 
	 * @param orderId 订单号
	 * @param type 活动类型（可选）
	 * @param states 状态列表（可选）
	 * @param isPrefor 是否计算业绩（可选）
	 * @param isPayment 是否计算金额（可选）
	 * @return 活动项目数量
	 */
	public long countDecorationActivityItem(String orderId, Short type, List<Short> states, Short isPrefor, Short isPayment);

	/**
	 * 统计指定订单 atttype 下的活动物品数量（全部状态）
	 *
	 * @param orderId 订单号
	 * @param atttype 线上线下标识
	 * @return 活动物品数量
	 */
	public int countDecorationActivityItem(String orderId, short atttype);

	/**
	 * 统计指定订单、no（线上活动物品编号）下的活动物品数量，用于唯一性校验
	 *
	 * @param orderId 订单号
	 * @param no 活动物品编号
	 * @return 活动物品数量
	 */
	public long countDecorationActivityItem(String orderId, String no);

	/**
	 * 批量核销:将指定订单 atttype 下、状态不在排除集合内的物品置为目标核销态
	 * 
	 * @param orderId 订单号
	 * @param atttype 线上线下标识
	 * @param targetState 目标状态
	 * @param excludeStates 排除状态集合（可选,排除已核销态避免重复操作）
	 * @param receiverId 核销人ID
	 * @return 受影响行数
	 */
	public int banchDecorationActivityItem(String orderId, short atttype, short targetState, List<Short> excludeStates, long receiverId);

}
