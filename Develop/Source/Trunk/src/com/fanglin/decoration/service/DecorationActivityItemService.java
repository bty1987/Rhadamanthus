/**
 * @File Name		: decorationActivityItemService.java
 * @Package   	: com.fanglin.decoration.service
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationOrderVO;

public interface DecorationActivityItemService {
	
	public List<DecorationActivityItemVO> queryDecorationActivityItemByOrderId(DecorationOrderVO decorationOrderVO);
	
	public List<DecorationActivityItemVO> queryDecorationActivityItemForCouponAVaildByOrderId(DecorationOrderVO decorationOrderVO);
	
	public int convertDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO) throws FLException;
	
	public int abateDecorationActionItem(DecorationActivityItemVO decorationActivityItemVO) throws FLException;
	
	public int receiveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId, String userName) throws FLException;
	
}
