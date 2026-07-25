package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.market.dao.MarketAttributionDao;
import com.fanglin.market.po.MarketAttributionPO;

@Repository("marketAttributionDao")
public class MarketAttributionDaoImpl extends DaoImpl<MarketAttributionPO> implements MarketAttributionDao {

	public MarketAttributionDaoImpl() {
		super(MarketAttributionPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MarketAttributionPO> queryMarketAttributionByCsid(long csid, int company) {
		return createCriteria(MarketAttributionPO.class).add(Restrictions.eq("csid", csid)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MarketAttributionPO> queryMarketAttributionByMiid(long miid, int company) {
		return createCriteria(MarketAttributionPO.class).add(Restrictions.eq("miid", miid)).add(Restrictions.eq("company", company)).list();
	}

}
