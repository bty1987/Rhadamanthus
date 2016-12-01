/**
 * @File Name		: MaterialOutsidePaymentService.java
 * @Package   	: com.fanglin.material.service
 * @Version		: 1.0
 * @Date			: 2015-10-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.MaterialOutsidePaymentVO;
import com.fanglin.utils.Paging;

public interface MaterialOutsidePaymentService {
	
	public void pageMaterialOutsidePayment(Paging paging, List<Filter> filters);
	
	public void pageMaterialOutsidePaymentForInit(Paging paging, List<Filter> filters);
	
	public void pageMaterialOutsidePaymentForNotInit(Paging paging, List<Filter> filters);
	
	public int collectMaterialOutsidePayment(MaterialOutsidePaymentVO materialOutsidePaymentVO, String userId, String userName) throws FLException;
	
}
