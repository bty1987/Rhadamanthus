package com.fanglin.balance.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceCutpayDao;
import com.fanglin.balance.po.BalanceCutpayPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceCutpayDao")
public class BalanceCutpayDaoImpl extends DaoImpl<BalanceCutpayPO> implements BalanceCutpayDao {

	public BalanceCutpayDaoImpl() {
		super(BalanceCutpayPO.class);
	}

	@Override
	public List<BalanceCutpayPO> pageBalanceCutpay(Paging paging, List<Filter> filters) {

		PagingQuery<BalanceCutpayPO> query = pagingQuery(paging, BalanceCutpayPO.class);

		queryFilterExcute(query, filters);

		query.desc("bcid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceCutpayPO> queryBalanceCutpay(long bid) {
		return session().createCriteria(BalanceCutpayPO.class).add(Restrictions.eq("balance.bid", bid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceCutpayPO> queryBalanceCutpayByOuid(int ouid) {
		return session().createCriteria(BalanceCutpayPO.class).add(Restrictions.eq("operater.uid", ouid)).list();
	}

	@Override
	public long amountBalanceCutpay(long bid) {

		String sql = "select sum(money)) from balance.balancecutpay where bid = :bid";

		BigDecimal amount = (BigDecimal) session().createSQLQuery(sql).setLong("bid", bid).uniqueResult();

		if (amount == null) return 0;

		return amount.longValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("dccountId".equals(field)) {
				query.alias("dccount", "dccount");
				query.add(query.getCriterion("dccount.bdid", Long.parseLong(data), op));
			} else if ("name".equals(field)) {
				query.add(Restrictions.ilike("name", data, MatchMode.ANYWHERE));
			} else if ("operaterId".equals(field)) {
				query.alias("operater", "operater");
				query.add(query.getCriterion("operater.userId", data, op));
			}
		}

	}
}
