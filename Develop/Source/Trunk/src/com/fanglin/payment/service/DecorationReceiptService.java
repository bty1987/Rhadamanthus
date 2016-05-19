/**
 * @File Name		: DecorationReceiptService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2015-11-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.vo.DecorationReceiptVO;

public interface DecorationReceiptService {
	
	public DecorationReceiptVO queryDecorationReceiptByDrId(DecorationReceiptVO decorationReceiptVO) throws FLException;
	
	public List<DecorationReceiptVO> queryDecorationReceiptByDrIds(List<Long> drIds);

}
