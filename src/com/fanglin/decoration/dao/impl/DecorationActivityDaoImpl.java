/**
 * @File Name		: DecorationActivityDaoImpl.java
 * @Package   	: com.fanglin.decoration.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-12-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.utils.Arith;

@Repository("decorationActivityDao")
public class DecorationActivityDaoImpl extends DaoImpl<DecorationActivityPO> implements DecorationActivityDao {

	public DecorationActivityDaoImpl() {
		super(DecorationActivityPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityPO> queryDecorationActivityByOrderId(String orderId) {
		return session().createCriteria(DecorationActivityPO.class).add(Restrictions.eq(DecorationActivityPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	public long amountDecorationActivity(String orderId, Short type, Short isPrefor, Short isPayment) {

		StringBuffer sql = new StringBuffer();

		sql.append("select COALESCE(SUM(money*num), 0) as amount from decoration.decorationActivityitem where orderId = :orderId");

		if (type != null) {
			sql.append(" and type = :type");
		}

		if (isPrefor != null) {
			sql.append(" and isPrefor = :isPrefor");
		}

		if (isPayment != null) {
			sql.append(" and isPayment = :isPayment");
		}

		SQLQuery sqlQuery = session().createSQLQuery(sql.toString());
		sqlQuery.setString("orderId", orderId);

		if (type != null) {
			sqlQuery.setShort("type", type);
		}
		
		if (isPrefor != null) {
			sqlQuery.setShort("isPrefor", isPrefor);
		}

		if (isPayment != null) {
			sqlQuery.setShort("isPayment", isPayment);
		}

		BigDecimal amount = (BigDecimal) sqlQuery.uniqueResult();

		return Arith.div(amount.longValue(), 1000000);
	}

	@Override
	public int countDecorationActivity(String orderId, Short status) {

		StringBuffer sql = new StringBuffer();

		sql.append("select count(*) from decoration.decorationactivity where orderId = :orderId");

		if (status != null) {
			sql.append(" and status = :status");

		}
		SQLQuery sqlQuery = session().createSQLQuery(sql.toString());
		sqlQuery.setString("orderId", orderId);

		if (status != null) {
			sqlQuery.setShort("status", status);
		}

		return ((BigInteger) sqlQuery.uniqueResult()).intValue();
	}

}
