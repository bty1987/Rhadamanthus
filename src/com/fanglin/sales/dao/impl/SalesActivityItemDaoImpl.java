package com.fanglin.sales.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesActivityItemDao;
import com.fanglin.sales.po.SalesActivityItemPO;
import com.fanglin.utils.Arith;

@Repository("salesActivityItemDao")
public class SalesActivityItemDaoImpl extends DaoImpl<SalesActivityItemPO> implements SalesActivityItemDao {

	public SalesActivityItemDaoImpl() {
		super(SalesActivityItemPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesActivityItemPO> querySalesActivityItem(String orderId) {
		return session().createCriteria(SalesActivityItemPO.class).add(Restrictions.eq(SalesActivityItemPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	public long amountSalesActivityItem(String orderId, Short type, List<Short> states) {

		StringBuffer sql = new StringBuffer();

		sql.append("SELECT COALESCE(SUM(money*num), 0) AS priceSum FROM sales.salesActivityitem WHERE orderId =:orderId");

		if (type != null) {
			sql.append(" AND type = :type");
		}

		if (states != null) {
			sql.append(" AND state IN (:state)");
		}

		SQLQuery sqlQuery = session().createSQLQuery(sql.toString());

		sqlQuery.setString("orderId", orderId);

		if (type != null) {
			sqlQuery.setShort("type", type);
		}

		if (states != null) {
			sqlQuery.setParameterList("state", states);
		}

		BigDecimal amount = (BigDecimal) sqlQuery.uniqueResult();

		return Arith.div(amount.longValue(), 1000000);
	}

}
