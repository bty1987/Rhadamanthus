package com.fanglin.sales.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesActivityDao;
import com.fanglin.sales.po.SalesActivityPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;

@Repository("salesActivityDao")
public class SalesActivityDaoImpl extends DaoImpl<SalesActivityPO> implements SalesActivityDao {

	public SalesActivityDaoImpl() {
		super(SalesActivityPO.class);
	}

	@Override
	public List<SalesActivityPO> pageSalesActivity(Paging paging, List<Filter> filter, String orderId) throws FLException {

		PagingQuery<SalesActivityPO> query = pagingQuery(paging, SalesActivityPO.class);

		if (orderId != null) {
			query.alias("sales", "sales").add(query.getCriterion("sales.orderId", orderId, "eq"));
		}

		queryFilterExcute(query, filter);

		query.desc("sid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object> querySalesActivityByTotal(String orderId) {

		String sql = "select ac.`name` AS name, sum(if(s.type in (2, 3, 8), s.refermoney, -s.refermoney)) AS amount from sales.sales sa,payment.salespayment s,information.activity ac where sa.sid=s.sid and s.status in (1,2) and sa.orderId= :orderId and sa.activityId=ac.aId group by sa.activityId";

		List<Object> uniqueResult = session().createSQLQuery(sql).addScalar("name", StandardBasicTypes.STRING).addScalar("amount", StandardBasicTypes.INTEGER).setString("orderId", orderId).list();

		return uniqueResult;
	}

	@Override
	public long amountSalesActivityForPayment(String orderId) {

		String sql = "select sum(sp.referMoney * a.multiple * if(sp.type in (2, 3, 8), 1, -1)) from sales.sales s, payment.salespayment sp, information.activity a where s.orderId = :orderId and s.sid = sp.sid and sp.status in (1, 2) and s.activityid = a.aid";

		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : Arith.div(sqlQuery.longValue(), 1000000);
	}

	@Override
	public long amountSalesActivityForActivity(String orderId) {

		String sql = "select sum(sai.integral * sai.num) from sales.salesactivityitem sai where sai.orderId = :orderId and sai.state not in (1, 3, 7)";

		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : Arith.div(sqlQuery.longValue(), 1000000);
	}

	private void queryFilterExcute(PagingQuery<SalesActivityPO> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		SalesDaoImpl.queryFilterExcute(query, filters, "sales");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("sales.activity.name".equals(field)) {
				query.alias("activity", "activity");
				query.add(query.getCriterion("activity.name", data, op));
			}
		}
	}

}
