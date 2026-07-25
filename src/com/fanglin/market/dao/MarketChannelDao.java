package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.MarketChannelPO;
import com.fanglin.utils.Paging;

public interface MarketChannelDao extends Dao<MarketChannelPO> {

	public List<MarketChannelPO> pageMarketChannel(Paging paging, List<Filter> filters, int company);

	public List<MarketChannelPO> queryMarketChannelForEnable(int company);

}
