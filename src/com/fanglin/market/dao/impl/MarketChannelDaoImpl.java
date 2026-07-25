package com.fanglin.market.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.MarketChannelDao;
import com.fanglin.market.po.MarketChannelPO;
import com.fanglin.utils.Paging;

@Repository("marketChannelDao")
public class MarketChannelDaoImpl extends DaoImpl<MarketChannelPO> implements MarketChannelDao {

	public MarketChannelDaoImpl() {
		super(MarketChannelPO.class);
	}

	@Override
	public List<MarketChannelPO> pageMarketChannel(Paging paging, List<Filter> filters, int company) {

		PagingQuery<MarketChannelPO> query = pagingQuery(paging, MarketChannelPO.class);

		query.add(query.getCriterion("company", company, "eq"));
		queryFilterExcute(query, filters);
		query.desc("mchid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MarketChannelPO> queryMarketChannelForEnable(int company) {
		return createCriteria(MarketChannelPO.class).add(getCriterion("company", company, "eq")).add(getCriterion("status", MarketChannelPO.STATUS_ENABLE_INT, "eq")).list();
	}

	private void queryFilterExcute(PagingQuery<MarketChannelPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field) || "platform".equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if ("type".equals(field) || "status".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("ownerId".equals(field)) {
				query.add(query.getCriterion(field, Long.valueOf(data), op));
			}
		}
	}

}
