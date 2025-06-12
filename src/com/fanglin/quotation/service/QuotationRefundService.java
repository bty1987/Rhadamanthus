package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationRefundVO;
import com.fanglin.utils.Paging;

public interface QuotationRefundService {

	public void pageQuotationRefund(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public QuotationRefundVO queryQuotationRefundById(QuotationRefundVO quotationRefundVO) throws FLException;

	public int addQuotationRefund(QuotationRefundVO quotationRefundVO, String userId) throws FLException;

	public int updateQuotationRefund(QuotationRefundVO quotationRefundVO) throws FLException;

	public int deleteQuotationRefund(QuotationRefundVO quotationRefundVO) throws FLException;
}
