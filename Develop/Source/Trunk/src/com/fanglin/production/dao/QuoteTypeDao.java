package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.QuoteTypePO;
import com.fanglin.utils.Paging;

public interface QuoteTypeDao extends Dao<QuoteTypePO>{

	public List<QuoteTypePO> pageQuoteType(Paging paging, List<Filter> filters);
	
	public List<QuoteTypePO> queryQuoteType();
	
}
