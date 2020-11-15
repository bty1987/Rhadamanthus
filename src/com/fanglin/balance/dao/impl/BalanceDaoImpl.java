package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceDao")
public class BalanceDaoImpl extends DaoImpl<BalancePO> implements BalanceDao {

	public BalanceDaoImpl() {
		super(BalancePO.class);
	}

	@Override
	public List<BalancePO> pageBalance(Paging paging, List<Filter> filters, int company) {

		PagingQuery<BalancePO> query = pagingQuery(paging, BalancePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("bid");

		return query.list();
	}

	@Override
	public List<BalancePO> queryBalance(List<Filter> filters, int company) {

		PagingQuery<BalancePO> query = pagingQuery(new Paging(), BalancePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.notPaging();

		return query.list();
	}

	@Override
	public BalancePO queryBalance(String no) {
		return (BalancePO) session().createCriteria(BalancePO.class).add(Restrictions.eq("no", no)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (BalancePO.COLUMN_NO_STR.equals(field)) {
				query.add(query.getCriterion(field, String.valueOf(data), op));
			} else if ("creater".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion("creater.uid", data, op));
			} else if ("belonger".equals(field)) {
				query.alias("belonger", "belonger");
				query.add(query.getCriterion("belonger.uid", Integer.valueOf(data), op));
			} else if (BalancePO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (BalancePO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else {
				query.add(query.getCriterion(field, data, op));
			}
		}

	}
}
