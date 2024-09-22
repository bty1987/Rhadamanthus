package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.PaymentScaleItemDao;
import com.fanglin.data.po.PaymentScaleItemPO;

@Repository("paymentScaleItemDao")
public class PaymentScaleItemDaoImpl extends DaoImpl<PaymentScaleItemPO> implements PaymentScaleItemDao {

	public PaymentScaleItemDaoImpl() {
		super(PaymentScaleItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentScaleItemPO> queryPaymentScaleItemByPsid(long psid) {
		return session().createCriteria(PaymentScaleItemPO.class).createAlias("paymentScale", "paymentScale").add(Restrictions.eq("paymentScale.psid", psid)).addOrder(Order.asc("sort")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentScaleItemPO> fetchPaymentScaleItem(Long ptid, Short typeness, Short atttype, Long dbid) {

		StringBuffer sql = new StringBuffer("select psi.* from data.paymentscale ps, data.paymentscaleitem psi where psi.psid = ps.psid");

		if (ptid != null) {
			sql.append(" and psi.ptid = :ptid ");
		}

		if (typeness != null) {
			sql.append(" and ps.typeness = :typeness ");
		}

		if (atttype != null) {
			sql.append(" and ps.atttype = :atttype ");
		}

		if (dbid != null) {
			sql.append(" and ps.dbid = :dbid ");
		}

		Query query = session().createSQLQuery(sql.toString()).addEntity(PaymentScaleItemPO.class);

		if (ptid != null) {
			query.setLong("ptid", ptid);
		}

		if (typeness != null) {
			query.setShort("typeness", typeness);
		}

		if (atttype != null) {
			query.setShort("atttype", atttype);
		}

		if (dbid != null) {
			query.setLong("dbid", dbid);
		}

		return query.list();
	}

	@Override
	public PaymentScaleItemPO queryPaymentScaleItem(long ptid, short typeness, short atttype, long dbid) {

		String sql = "select psi.* from data.paymentscale ps, data.paymentscaleitem psi where psi.ptid = :ptid and psi.psid = ps.psid and ps.typeness = :typeness and ps.atttype = :atttype and ps.dbid = :dbid";

		Query query = session().createSQLQuery(sql).addEntity(PaymentScaleItemPO.class).setLong("ptid", ptid).setShort("typeness", typeness).setShort("atttype", atttype).setLong("dbid", dbid);

		return (PaymentScaleItemPO) query.setMaxResults(1).uniqueResult();
	}

}
