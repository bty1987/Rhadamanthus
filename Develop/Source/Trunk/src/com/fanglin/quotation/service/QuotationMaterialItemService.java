/**
 * @File Name		: QuotationMaterialItemService.java
 * @Package   	: com.fanglin.quotation.service
 * @Version		: 1.0
 * @Date			: 2016-10-20
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationMaterialItemVO;
import com.fanglin.quotation.vo.QuotationVO;

public interface QuotationMaterialItemService {
	
	public List<QuotationMaterialItemVO> queryQuotationMaterialItemByQId(QuotationVO quotationVO);
	
	public int addQuotationMaterialItem(QuotationMaterialItemVO quotationMaterialItemVO) throws FLException;
	
	public int upgradeQuotationMaterialItem(QuotationMaterialItemVO quotationMaterialItemVO) throws FLException;
	
	public int discountQuotationMaterialItem(QuotationMaterialItemVO quotationMaterialItemVO) throws FLException;
	
	public int deleteQuotationMaterialItem(QuotationMaterialItemVO quotationMaterialItemVO);

}
