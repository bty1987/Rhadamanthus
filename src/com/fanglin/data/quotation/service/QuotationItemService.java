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

package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationPriceVO;
import com.fanglin.utils.Paging;

public interface QuotationItemService {

	public void pageQuotationItem(Paging paging, List<Filter> filters, int company);

	public void pageQuotationItemByVersionId(Paging paging, List<Filter> filters, QuotationItemVO quotationItemVO);

	public void pageQuotationItemForPrice(Paging paging, List<Filter> filters, QuotationItemVO quotationItemVO, QuotationPriceVO quotationPriceVO);

	public QuotationItemVO queryQuotationItemByItemIdAVersionId(QuotationItemVO quotationItemVO) throws FLException;

	public QuotationItemVO queryQuotationItemByQiid(QuotationItemVO quotationItemVO) throws FLException;

	public int addQuotationItem(QuotationItemVO quotationItemVO) throws FLException;

	public int updateQuotationItem(QuotationItemVO quotationItemVO) throws FLException;

	public int updateQuotationItemForStatus(QuotationItemVO quotationItemVO) throws FLException;

	public int updateQuotationItemForDiscount(QuotationItemVO quotationItemVO) throws FLException;

	public int updateQuotationItemForFormula(QuotationItemVO quotationItemVO) throws FLException;

	public int updateQuotationItemForCost(QuotationItemVO quotationItemVO) throws FLException;

}
