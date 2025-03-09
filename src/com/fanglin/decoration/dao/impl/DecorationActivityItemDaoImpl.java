/**
 * @File Name		: DecorationActivityItemDaoImpl.java
 * @Package   	: com.fanglin.decoration.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.utils.Arith;

@Repository("decorationActivityItemDao")
public class DecorationActivityItemDaoImpl extends DaoImpl<DecorationActivityItemPO> implements DecorationActivityItemDao {

	public DecorationActivityItemDaoImpl() {
		super(DecorationActivityItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityItemPO> queryDecorationActivityItemByOrderId(String orderId) {
		return session().createCriteria(DecorationActivityItemPO.class).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityItemPO> queryDecorationActivityItemByOrderId(String orderId, short type, short status) {
		return session().createCriteria(DecorationActivityItemPO.class).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq(DecorationActivityItemPO.COLUMN_STATUS_STR, status)).list();
	}

	@Override
	public long amountDecorationActivityItemForIsPayment(String orderId, short isPayment) {
		String sql = "select COALESCE(SUM(money*num), 0) as priceSum from decoration.decorationActivityitem where orderId =:orderId and type = 0 and isPayment =:isPayment and state = 0";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setShort("isPayment", isPayment).uniqueResult();

		return Arith.div(sqlQuery.longValue(), 1000000);
	}

	@Override
	public long amountDecorationActivityItem(String orderId, Short type, List<Short> states, Short isPrefor, Short isPayment) {

		StringBuffer sql = new StringBuffer();

		sql.append("SELECT COALESCE(SUM(money*num), 0) AS priceSum FROM decoration.decorationActivityitem WHERE orderId =:orderId");

		if (type != null) {
			sql.append(" AND type = :type");
		}

		if (states != null) {
			sql.append(" AND state IN (:state)");
		}

		if (isPrefor != null) {
			sql.append(" AND isPrefor = :isPrefor");
		}

		if (isPayment != null) {
			sql.append(" AND isPayment = :isPayment");
		}

		SQLQuery sqlQuery = session().createSQLQuery(sql.toString());

		sqlQuery.setString("orderId", orderId);

		if (type != null) {
			sqlQuery.setShort("type", type);
		}

		if (states != null) {
			sqlQuery.setParameterList("state", states);
		}

		if (isPrefor != null) {
			sqlQuery.setShort("isPrefor", isPrefor);
		}

		if (isPrefor != null) {
			sqlQuery.setShort("isPayment", isPayment);
		}

		BigDecimal amount = (BigDecimal) sqlQuery.uniqueResult();

		return Arith.div(amount.longValue(), 1000000);
	}
}
