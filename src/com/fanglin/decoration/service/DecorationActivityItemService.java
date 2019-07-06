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
import com.fanglin.decoration.vo.DecorationVO;

public interface DecorationActivityItemService {
	
	public List<DecorationActivityItemVO> queryDecorationActivityItemByOrderId(DecorationVO decorationVO);
	
	public int abateDecorationActionItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;
	
	public int receiveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId, String userName) throws FLException;
	
	public int deliveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;
	
	public int unrefundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;
	
	public int refundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;
	
	public int expendDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;
	
	public int amountDecorationActivityItem(DecorationVO decorationVO, String userId) throws FLException;
}
