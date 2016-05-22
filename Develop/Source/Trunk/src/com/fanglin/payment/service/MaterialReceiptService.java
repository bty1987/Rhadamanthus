/**
 * @File Name		: MaterialReceiptService.java
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
import com.fanglin.payment.vo.MaterialReceiptVO;

public interface MaterialReceiptService {
	
	public MaterialReceiptVO queryMaterialReceiptByMrId(MaterialReceiptVO materialReceiptVO) throws FLException;
	
	public List<MaterialReceiptVO> queryMaterialReceiptByMrIds(List<Long> mrIds);

}
