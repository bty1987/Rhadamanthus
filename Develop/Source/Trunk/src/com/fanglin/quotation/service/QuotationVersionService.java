/**
 * @File Name		: QuotationVersionService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.Paging;


public interface QuotationVersionService {
	
	public void pageQuotationVersion(Paging paging, List<FilterVO> filters);
	
	public QuotationVersionVO queryQuotationVersionById(QuotationVersionVO quotationVersionVO);
	
	public List<QuotationVersionVO> queryQuotationVersion();
	
	public void saveQuotationVersion(QuotationVersionVO quotationVersionVO);
	
	public void updateQuotationVersion(QuotationVersionVO quotationVersionVO);
	
	public void copyQuotationVersion(QuotationVersionVO quotationVersionVO, String sourceVersionId) throws FLException;
	
	public void deleteQuotationVersion(QuotationVersionVO quotationVersionVO);

	public void deleteQuotationVersionById(String id);

}
