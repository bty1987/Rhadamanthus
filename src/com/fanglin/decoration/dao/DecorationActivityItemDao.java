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

}
