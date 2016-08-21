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
import com.fanglin.decoration.po.DecorationBelongInfoPO;

public interface DecorationBelongDao extends Dao<DecorationBelongInfoPO> {
	
	public List<DecorationBelongInfoPO> queryOrderBelongInfoByOrderIdAType(String orderId, String belongType);

	public List<DecorationBelongInfoPO> queryOrderBelongInfoForCurrentByOrderIdAType(String orderId, String belongType);
	
	public List<DecorationBelongInfoPO> queryOrderBelongInfoByOrderId(String orderId);
	
	public List<DecorationBelongInfoPO> queryOrderBelongInfoByOrderIds(List<String> orderIds);
	
}
