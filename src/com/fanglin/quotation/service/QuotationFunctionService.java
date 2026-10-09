package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationFunctionVO;
import com.fanglin.utils.Paging;

public interface QuotationFunctionService {

	public List<QuotationFunctionVO> pageQuotationFunction(Paging paging, List<Filter> filters);

	public List<QuotationFunctionVO> queryQuotationFunction(QuotationFunctionVO quotationFunctionVO);

	public int addQuotationFunction(QuotationFunctionVO quotationFunctionVO) throws FLException;

	public int updateQuotationFunction(QuotationFunctionVO quotationFunctionVO) throws FLException;

	public int deleteQuotationFunction(QuotationFunctionVO quotationFunctionVO) throws FLException;

}
