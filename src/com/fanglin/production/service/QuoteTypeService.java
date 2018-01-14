package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.QuoteTypeVO;
import com.fanglin.utils.Paging;

public interface QuoteTypeService {

	public void pageQuoteType(Paging paging, List<Filter> filters);
	
	public List<QuoteTypeVO> queryQuoteType();
	
	public int addQuoteType(QuoteTypeVO quoteTypeVO) throws FLException;
	
	public int updateQuoteType(QuoteTypeVO quoteTypeVO) throws FLException;
	
	public int updateQuoteTypeForStatus(QuoteTypeVO quoteTypeVO) throws FLException;
}
