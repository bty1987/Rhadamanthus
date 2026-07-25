package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.MarketSourceDao;
import com.fanglin.market.po.MarketSourcePO;
import com.fanglin.utils.Paging;

@Repository("marketSourceDao")
public class MarketSourceDaoImpl extends DaoImpl<MarketSourcePO> implements MarketSourceDao {

	public MarketSourceDaoImpl() {
		super(MarketSourcePO.class);
	}

	@Override
	public List<MarketSourcePO> pageMarketSource(Paging paging, List<Filter> filters, int company) {

		PagingQuery<MarketSourcePO> query = pagingQuery(paging, MarketSourcePO.class);

		query.add(query.getCriterion("company", company, "eq"));
		queryFilterExcute(query, filters);
		query.desc("msid");

		return query.list();
	}

	@Override
	public MarketSourcePO queryMarketSourceByCode(String code, int company) {
		return (MarketSourcePO) createCriteria(MarketSourcePO.class).add(Restrictions.eq("code", code)).add(Restrictions.eq("company", company)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<MarketSourcePO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("code".equals(field) || "utmSource".equals(field) || "utmMedium".equals(field) || "utmCampaign".equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("channelId".equals(field) || "campaignId".equals(field) || "profileId".equals(field)) {
				query.add(query.getCriterion(field, Long.valueOf(data), op));
			}
		}
	}

}
