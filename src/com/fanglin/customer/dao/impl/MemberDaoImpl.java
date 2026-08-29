package com.fanglin.customer.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.MemberDao;
import com.fanglin.customer.po.PointAccountPO;

@Repository("memberDao")
public class MemberDaoImpl extends DaoImpl<PointAccountPO> implements MemberDao {

	public MemberDaoImpl() {
		super(PointAccountPO.class);
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

		String sql = "select CASE WHEN (select MIN(sdi.status) from sales.salesdeliveryitem sdi where sdi.sid in (select s2.sid from sales.sales s2 where s2.orderId = :orderId)) = 4 THEN sum(if(sp.type in (2, 3, 8), sp.referMoney, -sp.refermoney))*a.multiple/1000 ELSE 0 END from payment.salespayment sp, sales.sales s, information.activity a where s.orderId = :orderId and s.sid = sp.sid and sp.status in (1, 2) and s.activityid = a.aid and a.atttype = 1";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public long amountDecorationPointByOrderId(String orderId) {

		String sql = "SELECT SUM(dp.referMoney*a.multiple/1000) from payment.decorationpayment dp, decoration.decorationactivity da, information.activity a where dp.orderId = :orderId and dp.sort != 0 and dp.orderId = da.orderId and da.aid = a.aid and a.atttype = 1";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public long amountDecorationPointForFreezeByOrderId(String orderId) {

		String sql = "SELECT ap.balance*a.multiple/1000 from payment.advancepayment ap, decoration.decorationactivity da, information.activity a where ap.orderId = :orderId and ap.orderId = da.orderId and da.aid = a.aid and a.atttype = 1";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public long amountMaterialPointByOrderId(String orderId) {

		String sql = "SELECT SUM(p.recharge*a.multiple/1000) from payment.payment p, information.activity a where p.orderId = :orderId and p.type = 1 and p.paymentType = 2 and p.status != 3 and p.aid = a.aid";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> queryDecorationPointDetailByOrderId(String orderId) {

		String sql = "SELECT dp.paymentType, dp.referMoney, dp.paymentStatus, a.multiple, dp.referMoney*a.multiple/1000, dp.createTime from payment.decorationpayment dp, decoration.decorationactivity da, information.activity a where dp.orderId = :orderId and dp.sort != 0 and dp.orderId = da.orderId and da.aid = a.aid and a.atttype = 1 order by dp.dpid";
		return session().createSQLQuery(sql).setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> queryMaterialPointDetailByOrderId(String orderId) {

		String sql = "SELECT p.recharge, a.multiple, p.recharge*a.multiple/1000, p.status, p.createTime from payment.payment p, information.activity a where p.orderId = :orderId and p.type = 1 and p.paymentType = 2 and p.status != 3 and p.aid = a.aid order by p.pid";
		return session().createSQLQuery(sql).setString("orderId", orderId).list();
	}

}

