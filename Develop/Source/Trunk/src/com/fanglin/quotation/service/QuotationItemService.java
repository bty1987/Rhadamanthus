/**
 * @File Name		: QuotationItemService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.quotation.vo.QuotationItemVO;
import com.fanglin.utils.Paging;

public interface QuotationItemService {
	
	public void pageQuotationItem(Paging paging, List<FilterVO> filters);
	
	public void pageQuotationItemByVersionId(Paging paging, List<FilterVO> filters, QuotationItemVO quotationItemVO);

	public QuotationItemVO queryQuotationItemByItemIdAVersionId(QuotationItemVO quotationItemVO) throws FLException;
	
	public int addQuotationItem(QuotationItemVO quotationItemVO) throws FLException;
	
	public int updateQuotationItem(QuotationItemVO quotationItemVO) throws FLException;
	
	public int updateQuotationItemForStatus(QuotationItemVO quotationItemVO) throws FLException;
	
	public void deleteQuotationItem(QuotationItemVO quotationItemVO);
	
	public void deleteQuotationItemById(int id);

}
