package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.PuoteItemVO;
import com.fanglin.utils.Paging;

public interface PuoteItemService {
	public void pageQuoteItem(Paging paging,List<Filter> filter);
	
	public List<PuoteItemVO> queryQuoteItemByPinyin(PuoteItemVO quoteItemVO,int company);
	
	public int addQuoteItem(PuoteItemVO quoteItemVO,int company) throws FLException;
	
	public int updateQuoteItem(PuoteItemVO quoteItemVO) throws FLException;
	
	public int updateQuoteItemForStatus(PuoteItemVO quoteItemVO) throws FLException;
} 
