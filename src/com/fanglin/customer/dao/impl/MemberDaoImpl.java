package com.fanglin.customer.dao.impl;

import java.math.BigDecimal;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.MemberDao;
import com.fanglin.customer.po.GroupPO;

@Repository("memberDao")
public class MemberDaoImpl extends DaoImpl<GroupPO> implements MemberDao {

	public MemberDaoImpl() {
		super(GroupPO.class);
	}

	@Override
	public long totalMemberPointForDecoration(String orderId) {

		String sql = "SELECT SUM(referMoney) from payment.decorationpayment where orderId = :orderId AND onetype = 1 AND twotype = 1";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public long amountMemberPointForDecoration(String orderId) {

		String sql = "SELECT SUM(referMoney) from payment.decorationpayment where orderId = :orderId AND paymentStatus IN (1, 2) AND onetype = 1 AND twotype = 1";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public long totalMemberPointForMaterial(String orderId) {

		String sql = "select sum(if(sp.type in (2, 3, 8), sp.referMoney, -sp.refermoney)) from payment.salespayment sp, sales.sales s where s.orderId = :orderId and s.sid = sp.sid and sp.status in (1, 2)";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public long amountMemberPointForMaterial(String orderId) {

		String sql = "select sum(if(sp.type in (2, 3, 8), sp.referMoney, -sp.refermoney)) * min(if(sdi.status = 4, 1, 0)) from payment.salespayment sp, sales.sales s, sales.salesdeliveryitem sdi where s.orderId = :orderId and s.sid = sp.sid and sp.status in (1, 2) and s.sid = sdi.sid";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

}
