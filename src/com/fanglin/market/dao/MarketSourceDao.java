package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.MarketSourcePO;
import com.fanglin.utils.Paging;

public interface MarketSourceDao extends Dao<MarketSourcePO> {

	public List<MarketSourcePO> pageMarketSource(Paging paging, List<Filter> filters, int company);

	public MarketSourcePO queryMarketSourceByCode(String code, int company);

}
