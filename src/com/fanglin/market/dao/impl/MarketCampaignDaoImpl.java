package com.fanglin.market.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.MarketCampaignDao;
import com.fanglin.market.po.MarketCampaignPO;
import com.fanglin.utils.Paging;

@Repository("marketCampaignDao")
public class MarketCampaignDaoImpl extends DaoImpl<MarketCampaignPO> implements MarketCampaignDao {

	public MarketCampaignDaoImpl() {
		super(MarketCampaignPO.class);
	}

	@Override
	public List<MarketCampaignPO> pageMarketCampaign(Paging paging, List<Filter> filters, int company) {

		PagingQuery<MarketCampaignPO> query = pagingQuery(paging, MarketCampaignPO.class);

		query.add(query.getCriterion("company", company, "eq"));
		queryFilterExcute(query, filters);
		query.desc("mcid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MarketCampaignPO> queryMarketCampaignForEnable(int company) {
		return createCriteria(MarketCampaignPO.class).add(getCriterion("company", company, "eq")).add(getCriterion("status", MarketCampaignPO.STATUS_ENABLE_INT, "eq")).list();
	}

	private void queryFilterExcute(PagingQuery<MarketCampaignPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if ("type".equals(field) || "status".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("regionId".equals(field) || "ownerId".equals(field)) {
				query.add(query.getCriterion(field, Long.valueOf(data), op));
			}
		}
	}

}
