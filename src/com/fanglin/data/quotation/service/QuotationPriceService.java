package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.QuotationPriceVO;
import com.fanglin.utils.Paging;

public interface QuotationPriceService {

	public void pageQuotationPrice(Paging paging, List<Filter> filters, QuotationPriceVO quotationPriceVO);

	public int addQuotationPrice(QuotationPriceVO quotationPriceVO) throws FLException;

	public int updateQuotationPrice(QuotationPriceVO quotationPriceVO) throws FLException;

	public int deleteQuotationPrice(QuotationPriceVO quotationPriceVO) throws FLException;

}
