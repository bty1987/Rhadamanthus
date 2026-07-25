package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.market.po.MarketAttributionPO;

public interface MarketAttributionDao extends Dao<MarketAttributionPO> {

	public List<MarketAttributionPO> queryMarketAttributionByCsid(long csid, int company);

	public List<MarketAttributionPO> queryMarketAttributionByMiid(long miid, int company);

}
