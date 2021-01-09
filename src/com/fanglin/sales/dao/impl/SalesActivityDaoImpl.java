package com.fanglin.sales.dao.impl;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesActivityDao;
import com.fanglin.sales.po.SalesActivityPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("salesActivityDao")
public class SalesActivityDaoImpl extends DaoImpl<SalesActivityPO> implements SalesActivityDao {

	public SalesActivityDaoImpl() {
		super(SalesActivityPO.class);
	}

	@Override
	public List<SalesActivityPO> pageSalesActivity(Paging paging, List<Filter> filter, String orderId) {

		PagingQuery<SalesActivityPO> query = pagingQuery(paging, SalesActivityPO.class);

		if(orderId != null){
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

	private void queryFilterExcute(PagingQuery<SalesActivityPO> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				query.alias("sales", "sales");

				if (field.equals("sales.brand")) {
					query.add(query.getCriterion("sales.brand", data, op));
				} else if (field.equals("sales.category")) {
					query.add(query.getCriterion("sales.category", data, op));
				} else if (SalesActivityPO.COLUMN_SALESNO_STR.equals(field)) {
					query.add(query.getCriterion(SalesActivityPO.COLUMN_SALESNO_STR, data, op));
				} else if (SalesActivityPO.COLUMN_SALESORDERID_STR.equals(field)) {
					query.add(query.getCriterion(SalesActivityPO.COLUMN_SALESORDERID_STR, data, op));
				} else if (SalesActivityPO.COLUMN_SALESCREATETIME_STR.equals(field)) {
					
					String sCreateTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eCreateTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sCreatedate = DateUtil.parseDate(sCreateTime, "yyyy-MM-dd HH:mm:ss");
					Date eCreatedate = DateUtil.parseDate(eCreateTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sCreatetimestamp = DateUtil.getDateToTimestamp(sCreatedate);
					Timestamp eCreatetimestamp = DateUtil.getDateToTimestamp(eCreatedate);

					query.add(query.getCriterion(field, sCreatetimestamp, "ge"));
					query.add(query.getCriterion(field, eCreatetimestamp, "le"));
				} else {
					query.alias("activity", "activity");
					query.add(query.getCriterion(field, data, op));
				}
			}
		}

	}

}
