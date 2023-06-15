package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.utils.Paging;

public interface QuotationCtemService {

	public void pageQuotationCtem(Paging paging, List<Filter> filters);

	public List<QuotationCtemVO> queryQuotationCtem(QuotationCtemVO quotationCtemVO);

	public int addQuotationCtem(QuotationCtemVO quotationCtemVO) throws FLException;

	public int updateQuotationCtem(QuotationCtemVO quotationCtemVO) throws FLException;

	public int updateQuotationCtemForStatus(QuotationCtemVO quotationCtemVO) throws FLException;
}
