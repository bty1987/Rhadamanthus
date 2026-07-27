package com.fanglin.market.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.MarketInboundDao;
import com.fanglin.market.po.MarketInboundPO;
import com.fanglin.utils.Paging;

@Repository("marketInboundDao")
public class MarketInboundDaoImpl extends DaoImpl<MarketInboundPO> implements MarketInboundDao {

	public MarketInboundDaoImpl() {
		super(MarketInboundPO.class);
	}

	@Override
	public List<MarketInboundPO> pageMarketInbound(Paging paging, List<Filter> filters, int company) {

		PagingQuery<MarketInboundPO> query = pagingQuery(paging, MarketInboundPO.class);

		query.add(query.getCriterion("company", company, "eq"));
		queryFilterExcute(query, filters);
		query.desc("miid");

		return query.list();
	}

	@Override
	public MarketInboundPO queryMarketInboundByNo(String inboundNo, int company) {
		return (MarketInboundPO) createCriteria(MarketInboundPO.class).add(Restrictions.eq("inboundNo", inboundNo)).add(Restrictions.eq("company", company)).uniqueResult();
	}

	@Override
	public MarketInboundPO queryMarketInboundByIdempotentKey(String idempotentKey, int company) {
		return (MarketInboundPO) createCriteria(MarketInboundPO.class).add(Restrictions.eq("idempotentKey", idempotentKey)).add(Restrictions.eq("company", company)).uniqueResult();
	}

	@Override
	public int countMarketInboundForCampaign(long campaignId, short status, int company) {

		String sql = "select count(*) from market.marketinbound where campaignId = :campaignId and status = :status and company = :company";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("campaignId", campaignId).setShort("status", status).setInteger("company", company).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countMarketInboundForChannel(long channelId, short status, int company) {

		String sql = "select count(*) from market.marketinbound where channelId = :channelId and status = :status and company = :company";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("channelId", channelId).setShort("status", status).setInteger("company", company).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<MarketInboundPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("inboundNo".equals(field) || "name".equals(field) || "phoneHash".equals(field) || "orderId".equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("campaignId".equals(field) || "channelId".equals(field) || "sourceId".equals(field) || "csid".equals(field) || "ccid".equals(field)) {
				query.add(query.getCriterion(field, Long.valueOf(data), op));
			}
		}
	}

}
