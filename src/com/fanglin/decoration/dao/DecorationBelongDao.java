/**
 * @File Name		: OrderBelongInfoDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationBelongPO;

public interface DecorationBelongDao extends Dao<DecorationBelongPO> {
	
	public List<DecorationBelongPO> queryOrderBelongInfoByOrderIdAType(String orderId, Short belongType);

	public List<DecorationBelongPO> queryOrderBelongInfoForCurrentByOrderIdAType(String orderId, Short belongType);
	
	public List<DecorationBelongPO> queryOrderBelongInfoByOrderId(String orderId);
	
	public List<DecorationBelongPO> queryOrderBelongInfoByOrderIds(List<String> orderIds);
	
	public int changeOrderBelongInfoForOrderId(String newOrderId, String oldOrderId);
	
}
