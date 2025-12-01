package com.fanglin.balance.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceOalesDao;
import com.fanglin.balance.po.BalanceOalesBO;
import com.fanglin.balance.po.BalanceOalesPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceOalesDao")
public class BalanceOalesDaoImpl extends DaoImpl<BalanceOalesPO> implements BalanceOalesDao {

	public BalanceOalesDaoImpl() {
		super(BalanceOalesPO.class);
	}

	@Override
	public List<BalanceOalesPO> pageBalanceOales(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<BalanceOalesPO> query = pagingQuery(paging, BalanceOalesPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.desc("boid");

		return query.list();
	}

	@Override
	public List<BalanceOalesBO> pageBalanceOalesForBalance(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<BalanceOalesBO> query = pagingQuery(paging, BalanceOalesBO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters, "balance");

		query.desc("boid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceOalesPO> queryBalanceOales(String name, int company) {
		return session().createCriteria(BalanceOalesPO.class).add(Restrictions.ilike("name", name, MatchMode.ANYWHERE)).add(Restrictions.eq("status", BalanceOalesPO.STATUS_INIT_INT)).add(Restrictions.eq("company", company)).addOrder(Order.desc("boid")).setMaxResults(10).list();
	}

	@Override
	public long amountBalanceOales(long boid) {

		String sql = "select sum(if(oi.type = 0, oi.profit, -oi.profit)) from balance.balanceoalesitem boi, sales.oales oi where boi.boid = :boid and boi.oid = oi.oid";

		BigDecimal amount = (BigDecimal) session().createSQLQuery(sql).setLong("boid", boid).uniqueResult();

		if (amount == null) return 0;

		return amount.longValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {
		queryFilterExcute(query, filters, null);
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		if (prefix != null) BalanceDaoImpl.queryFilterExcute(query, filters, prefix);

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(Restrictions.ilike("name", data, MatchMode.ANYWHERE));
			} else if ("status".equals(field)) {
				query.add(Restrictions.eq("status", Short.valueOf(data)));
			} else if ("grade".equals(field)) {
				query.add(query.getCriterion("grade", data, op));
			} else if ("createrId".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion("creater.userId", data, op));
			} else if ("createTimeRange".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("lockTimeRange".equals(field)) {
				query.timeranges("lockTime", "lockTime", data);
			}
		}
	}

}
