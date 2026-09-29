package com.fanglin.balance.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceDao;
import com.fanglin.balance.po.BalancePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceDao")
public class BalanceDaoImpl extends DaoImpl<BalancePO> implements BalanceDao {

	public BalanceDaoImpl() {
		super(BalancePO.class);
	}

	@Override
	public List<BalancePO> pageBalance(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<BalancePO> query = pagingQuery(paging, BalancePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("bid");

		return query.list();
	}

	@Override
	public List<BalancePO> queryBalance(List<Filter> filters, int company) throws FLException {

		PagingQuery<BalancePO> query = pagingQuery(new Paging(), BalancePO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.notPaging();

		return query.list();
	}

	@Override
	public int updateBalanceForSurplus(long bid, long money) {

		String sql = "update balance set surplus = surplus - :money where bid = :bid and (type <> 0 or surplus >= :money)";

		return session().createSQLQuery(sql).setLong("bid", bid).setLong("money", money).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {
		queryFilterExcute(query, filters, "");
	}

	public static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		if (prefix == null) {
			prefix = "";
		}

		if (!"".equals(prefix)) {

			query.alias(prefix, prefix);
			prefix = String.format("%s.", prefix);
		}

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.contains("belonger")) {
				query.alias(String.format("%sbelonger", prefix), String.format("%sbelonger", prefix));
			} else if (field.contains("creater")) {
				query.alias(String.format("%screater", prefix), String.format("%screater", prefix));
			}

			if ("balance.no".equals(field)) {
				query.add(query.getCriterion(String.format("%sno", prefix), String.valueOf(data), op));
			} else if ("balance.creater".equals(field)) {
				query.add(query.getCriterion(String.format("%screater.uid", prefix), data, op));
			} else if ("balance.belonger".equals(field)) {
				query.add(query.getCriterion(String.format("%sbelonger.uid", prefix), Integer.valueOf(data), op));
			} else if ("balance.status".equals(field)) {
				query.add(query.getCriterion(String.format("%sstatus", prefix), Short.valueOf(data), op));
			} else if ("balance.type".equals(field)) {
				query.add(query.getCriterion(String.format("%stype", prefix), Short.valueOf(data), op));
			} else if ("balance.isPay".equals(field)) {
				query.add(query.getCriterion(String.format("%sisPay", prefix), Short.valueOf(data), op));
			}
		}

	}
}
