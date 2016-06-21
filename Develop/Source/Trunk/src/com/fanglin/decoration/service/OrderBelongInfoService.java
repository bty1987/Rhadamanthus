/**
 * @File Name		: OrderDesignPictureService
 * @Package   	: com.fanglin.service.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.decoration.vo.OrderBelongInfoVO;

public interface OrderBelongInfoService {
	
	public List<OrderBelongInfoVO> queryOrderBelongInfoForCurrentByOrderIdAType(String decorationOrderId, String belongType);

	public List<OrderBelongInfoVO> queryOrderBelongInfoForChangeByOrderIdAType(String decorationOrderId, String belongType);

	public List<OrderBelongInfoVO> queryApprovalingOrderBelongInfosByOrderIdAndBelongType(String decorationOrderId, String belongType);
	
	public List<OrderBelongInfoVO> queryOrderBelongInfoByOrderId(OrderBelongInfoVO orderBelongInfoVO);

}
