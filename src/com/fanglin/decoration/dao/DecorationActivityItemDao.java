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

	public long amountDecorationActivityItemForIsPayment(String orderId, short isPayment);

	public long amountDecorationActivityItem(String orderId, Short type, List<Short> states, Short isPrefor, Short isPayment);

}
