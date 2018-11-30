package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.CardPO;
import com.fanglin.utils.Paging;

public interface CardDao extends Dao<CardPO> {
	
	public CardPO queryCardByCuid(long cuid);
	
	public List<CardPO> pageCard(Paging paging, List<Filter> filter);
	
}
