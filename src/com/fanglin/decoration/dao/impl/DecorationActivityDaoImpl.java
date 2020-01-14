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

import java.math.BigInteger;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.po.DecorationActivityPO;

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
