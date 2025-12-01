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

		String sql = "SELECT SUM(dp.referMoney*a.multiple/1000) from payment.decorationpayment dp, decoration.decorationactivity da, information.activity a where dp.orderId = :orderId AND dp.onetype = 0 AND dp.twotype = 1 and dp.orderId = da.orderId and da.aid = a.aid and a.atttype = 1";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public long amountMemberPointForDecoration(String orderId) {

		String sql = "SELECT SUM(dp.referMoney*a.multiple/1000) from payment.decorationpayment dp, payment.decorationreceipt dr, decoration.decorationactivity da, information.activity a where dp.orderId = :orderId AND dp.paymentStatus IN (1, 2) AND dp.onetype = 0 AND dp.twotype = 1 and dp.drid = dr.drid and dp.orderId = da.orderId and da.aid = a.aid and a.atttype = 1 and dp.sort != 0 and DATEDIFF(NOW(), dr.collecttime) < a.validays";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public long totalMemberPointForMaterial(String orderId) {

		String sql = "select sum(if(sp.type in (2, 3, 8), sp.referMoney, -sp.refermoney)*a.multiple/1000) from payment.salespayment sp, sales.sales s, information.activity a where s.orderId = :orderId and s.sid = sp.sid and sp.status in (1, 2) and s.activityid = a.aid and a.atttype = 1";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public long amountMemberPointForMaterial(String orderId) {

		String sql = "select sum(if(sp.type in (2, 3, 8), sp.referMoney, -sp.refermoney))*min(if(sdi.status = 4, 1, 0)*a.multiple/1000) from payment.salespayment sp, sales.sales s, sales.salesdeliveryitem sdi, information.activity a where s.orderId = :orderId and s.sid = sp.sid and sp.status in (1, 2) and s.sid = sdi.sid and s.activityid = a.aid and a.atttype = 1";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

}

