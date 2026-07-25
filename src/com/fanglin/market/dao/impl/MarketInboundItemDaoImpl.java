package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.market.dao.MarketInboundItemDao;
import com.fanglin.market.po.MarketInboundItemPO;

@Repository("marketInboundItemDao")
public class MarketInboundItemDaoImpl extends DaoImpl<MarketInboundItemPO> implements MarketInboundItemDao {

	public MarketInboundItemDaoImpl() {
		super(MarketInboundItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MarketInboundItemPO> queryMarketInboundItemByMiid(long miid) {
		return createCriteria(MarketInboundItemPO.class).add(Restrictions.eq("miid", miid)).list();
	}

}
