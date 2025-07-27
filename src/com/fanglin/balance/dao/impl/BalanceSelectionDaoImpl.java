package com.fanglin.balance.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceSelectionDao;
import com.fanglin.balance.po.BalanceSelectionBO;
import com.fanglin.balance.po.BalanceSelectionPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;

@Repository("balanceSelectionDao")
public class BalanceSelectionDaoImpl extends DaoImpl<BalanceSelectionPO> implements BalanceSelectionDao {

	public BalanceSelectionDaoImpl() {
		super(BalanceSelectionPO.class);
	}

	@Override
	public List<BalanceSelectionPO> pageBalanceSelection(Paging paging, List<Filter> filters, int company) {

		PagingQuery<BalanceSelectionPO> query = pagingQuery(paging, BalanceSelectionPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.desc("bsid");

		return query.list();
	}

	@Override
	public List<BalanceSelectionBO> pageBalanceSelectionForBalance(Paging paging, List<Filter> filters, Short status, int company) {

		PagingQuery<BalanceSelectionBO> query = pagingQuery(paging, BalanceSelectionBO.class);

		query.add(Restrictions.eq("company", company));

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		queryFilterExcute(query, filters);

		query.desc("bsid");

		return query.list();
	}

	@Override
	public List<BalanceSelectionPO> pageBalanceSelectionForSupplier(Paging paging, List<Filter> filters, String userId, int company) {

		PagingQuery<BalanceSelectionPO> query = pagingQuery(paging, BalanceSelectionPO.class);

		query.alias("brand", "brand").alias("brand.supplier", "supplier").add(Restrictions.eq("supplier.userId", userId)).add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.desc("bsid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceSelectionPO> queryBalanceSelection(String name, int company) {
		return session().createCriteria(BalanceSelectionPO.class).add(Restrictions.ilike("name", name, MatchMode.ANYWHERE)).add(Restrictions.eq("status", BalanceSelectionPO.STATUS_INIT_INT)).add(Restrictions.eq("company", company)).addOrder(Order.desc("bsid")).setMaxResults(10).list();
	}

	@Override
	public BalanceSelectionPO queryBalanceSelection(long bid, String grade, int company) {
		return (BalanceSelectionPO) session().createCriteria(BalanceSelectionPO.class).createAlias("brand", "brand").add(Restrictions.eq("brand.bid", bid)).add(Restrictions.eq("status", BalanceSelectionPO.STATUS_INIT_INT)).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

	@Override
	public long amountBalaceSelection(long bsid) {

		String sql = "select sum(if(si.type in (2, 4),-(si.num-si.refnum),(si.num-si.refnum))*si.postprice) from balance.balanceselectionitem bsi, quotation.selectionitem si where bsi.bsid = :bsid and bsi.siid = si.siid";

		BigDecimal amount = (BigDecimal) session().createSQLQuery(sql).setLong("bsid", bsid).uniqueResult();

		if (amount == null) return 0;

		return Arith.div(amount.longValue(), 1000000);
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

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
			} else if ("createTimeDateRange".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("createrId".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion("creater.userId", data, op));
			} else if ("brandId".equals(field)) {
				query.alias("brand", "brand");
				query.add(query.getCriterion("brand.bid", Long.valueOf(data), op));
			} else if ("balanceNo".equals(field)) {
				query.alias("balance", "balance");
				query.add(query.getCriterion("balance.no", String.valueOf(data), op));
			} else if ("balanceType".equals(field)) {
				query.alias("balance", "balance");
				query.add(query.getCriterion("balance.type", Short.valueOf(data), op));
			} else if ("balanceStatus".equals(field)) {
				query.alias("balance", "balance");
				query.add(query.getCriterion("balance.status", Short.valueOf(data), op));
			} else if ("balanceIsPay".equals(field)) {
				query.alias("balance", "balance");
				query.add(query.getCriterion("balance.isPay", Short.valueOf(data), op));
			} else if ("lockTimeDateRange".equals(field)) {
				query.timeranges("lockTime", "lockTime", data);
			}
		}
	}

}
