/**
 * @File Name		: MaterialInsidePaymentService.java
 * @Package   	: com.fanglin.service.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.payment.vo.MaterialInsidePaymentVO;
import com.fanglin.utils.Paging;

public interface MaterialInsidePaymentService {
	
	public void pageMaterialInside(Paging paging, List<FilterVO> filters);
	
	public void pageMaterialInsidePaymentForInit(Paging paging, List<FilterVO> filters);
	
	public void pageMaterialInsidePaymentForNotInit(Paging paging, List<FilterVO> filters);
	
	public int collectMaterialInsidePayment(MaterialInsidePaymentVO materialInsidePaymentVO, String userId);
	
	public void confirmMaterialInsidePayment(List<Long> mipIds);

}
