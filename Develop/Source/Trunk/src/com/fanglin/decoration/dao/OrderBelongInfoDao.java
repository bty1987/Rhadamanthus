/**
 * @File Name		: OrderBelongInfoDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.OrderBelongInfoPO;

public interface OrderBelongInfoDao extends Dao<OrderBelongInfoPO> {
	
	public List<OrderBelongInfoPO> queryOrderBelongInfoByOrderIdAType(String orderId, String belongType);

	public List<OrderBelongInfoPO> queryOrderBelongInfoForCurrentByOrderIdAType(String orderId, String belongType);
	
	public List<OrderBelongInfoPO> queryOrderBelongInfoByOrderId(String orderId);
	
	public List<OrderBelongInfoPO> queryOrderBelongInfoByOrderIds(List<String> orderIds);
	
}
