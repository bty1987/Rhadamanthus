package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.market.po.MarketInboundItemPO;

public interface MarketInboundItemDao extends Dao<MarketInboundItemPO> {

	public List<MarketInboundItemPO> queryMarketInboundItemByMiid(long miid);

}
