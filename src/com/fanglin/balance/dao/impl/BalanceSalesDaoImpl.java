package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceSalesDao;
import com.fanglin.balance.po.BalanceSalesBO;
import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceSalesDao")
public class BalanceSalesDaoImpl extends DaoImpl<BalanceSalesPO> implements BalanceSalesDao {

	public BalanceSalesDaoImpl() {
		super(BalanceSalesPO.class);
	}

	@Override
	public List<BalanceSalesBO> pageBalanceSales(Paging paging, List<Filter> filters, int company) {

		PagingQuery<BalanceSalesBO> query = pagingQuery(paging, BalanceSalesBO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.desc("bsid");

		return query.list();
	}

	@Override
	public List<BalanceSalesBO> pageBalanceSalesForBalance(Paging paging, List<Filter> filters, Short status, int company) {

		PagingQuery<BalanceSalesBO> query = pagingQuery(paging, BalanceSalesBO.class);

		query.add(Restrictions.eq("company", company));

		if (status != null) query.add(Restrictions.eq("status", status));

		queryFilterExcute(query, filters);

		query.desc("bsid");

		return query.list();
	}

	@Override
	public List<BalanceSalesBO> pageBalanceSalesForSupplier(Paging paging, List<Filter> filters, String userId, int company) {

		PagingQuery<BalanceSalesBO> query = pagingQuery(paging, BalanceSalesBO.class);

		query.alias("brand", "brand").alias("supplier", "supplier").add(Restrictions.eq("supplier.userId", userId)).add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.desc("bsid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceSalesPO> queryBalanceSales(String name, int company) {
		return session().createCriteria(BalanceSalesPO.class).add(Restrictions.ilike("name", name, MatchMode.ANYWHERE)).add(Restrictions.eq("status", BalanceSalesPO.STATUS_INIT_INT)).add(Restrictions.eq("company", company)).addOrder(Order.desc("bsid")).setMaxResults(10).list();
	}

	@Override
	public BalanceSalesPO queryBalanceSales(long bid, int suid, String grade, short status, short atttype, int company) {
		return (BalanceSalesPO) session().createCriteria(BalanceSalesPO.class).add(Restrictions.eq("status", status)).add(Restrictions.eq("atttype", atttype)).add(Restrictions.eq("company", company)).createAlias("supplier", "supplier").add(Restrictions.eq("supplier.uid", suid)).createCriteria("brand", "brand").add(Restrictions.eq("brand.bid", bid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public Object[] amountBalanceSales(long bsid) {

		String sql = "select sum(if(sb.onetype = 0, if(sb.type = 3, s.depositpay, s.depositpay+s.fullpay), if(sb.onetype = 1, sb.total, if(onetype in (2, 3), sb.total, 0)))*sb.rate/1000) as 'income',sum(pbalance) as 'cost',sum(if(sb.onetype = 0, sb.pbalance - round(s.venderMaling, 0), if(sb.onetype = 1, sb.pbalance, if(onetype in (2, 3), sb.pbalance + round(s.venderMaling, 0), 0)))) as 'payment' from balance.balancesalesbalance bsb, sales.salesbalance sb, sales.sales s where bsb.bsid = :bsid and bsb.sbid = sb.sbid and sb.sid = s.sid";

		Object[] amount = (Object[]) session().createSQLQuery(sql).addScalar("income", StandardBasicTypes.LONG).addScalar("cost", StandardBasicTypes.LONG).addScalar("payment", StandardBasicTypes.LONG).setLong("bsid", bsid).uniqueResult();

		return amount;
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
			} else if ("createrId".equals(field)) {
				query.alias("creater", "creater").add(query.getCriterion("creater.userId", data, op));
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
				query.alias("balance", "balance").add(query.getCriterion("balance.isPay", Short.valueOf(data), op));
			} else if ("createTimeRange".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("lockTimeRange".equals(field)) {
				query.timeranges("lockTime", "lockTime", data);
			} else if ("balanceTimeRange".equals(field)) {
				query.timeranges("balanceTime", "balanceTime", data);
			}
		}
	}
}
