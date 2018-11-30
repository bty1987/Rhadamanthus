package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.CardVO;
import com.fanglin.utils.Paging;

public interface CardService {

	public CardVO queryCardByCuid(CardVO cardVO);
	
	public void pageCard(Paging paging, List<Filter> filters);
	
	public void addCard(CardVO cardVO) throws FLException;
	
	public void updateCard(CardVO cardVO) throws FLException;
	
	public void deleteCard(CardVO cardVO) throws FLException;
}
