/**
 * @File Name		: OrderDesignPictureService
 * @Package   	: com.fanglin.service.decoration;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.decoration.vo.DecorationBelongVO;

public interface DecorationBelongService {
	
	public List<DecorationBelongVO> queryOrderBelongInfoForCurrentByOrderIdAType(String decorationOrderId, Short belongType);

	public List<DecorationBelongVO> queryOrderBelongInfoForChangeByOrderIdAType(String decorationOrderId, Short belongType);

	public List<DecorationBelongVO> queryApprovalingOrderBelongInfosByOrderIdAndBelongType(String decorationOrderId, Short belongType);
	
	public List<DecorationBelongVO> queryOrderBelongInfoByOrderId(DecorationBelongVO orderBelongInfoVO);

}
