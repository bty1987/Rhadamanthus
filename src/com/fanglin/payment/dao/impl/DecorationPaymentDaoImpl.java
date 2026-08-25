/**
 * @File Name		: DecorationPaymentDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.utils.Paging;

@Repository("decorationPaymentDao")
public class DecorationPaymentDaoImpl extends DaoImpl<DecorationPaymentPO> implements DecorationPaymentDao {

	public DecorationPaymentDaoImpl() {
		super(DecorationPaymentPO.class);
	}

	@Override
	public List<DecorationPaymentPO> pageDecorationPayment(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<DecorationPaymentPO> query = pagingQuery(paging, DecorationPaymentPO.class);

		queryFilterExcute(query, filters);

		query.asc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByDpids(List<Long> dpids) {
		return session().createCriteria(DecorationPaymentPO.class).add(Restrictions.in("dpid", dpids)).list();
	}

	@Override
	public List<DecorationPaymentPO> queryDecorationPaymentByOrderId(List<Filter> filters) throws FLException {

		PagingQuery<DecorationPaymentPO> query = pagingQuery(new Paging(), DecorationPaymentPO.class);

		queryFilterExcute(query, filters);

		query.asc("createTime");

		query.notPaging();

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByOrderId(String orderId, Short[] paymentStatus, short oneType, short twoType) {
		return session().createCriteria(DecorationPaymentPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).add(Restrictions.in("paymentStatus", paymentStatus)).add(Restrictions.eq("oneType", oneType)).add(Restrictions.eq("twoType", twoType)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentForNotInit(long drId) {
		return session().createCriteria(DecorationPaymentPO.class).createAlias("decorationReceipt", "decorationReceipt").add(Restrictions.eq("decorationReceipt.drId", drId)).add(Restrictions.not(Restrictions.eq("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT))).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByDrid(long drid) {
		return session().createCriteria(DecorationPaymentPO.class).createAlias("decorationReceipt", "decorationReceipt").add(Restrictions.eq("decorationReceipt.drid", drid)).list();
	}

	@Override
	public DecorationPaymentPO queryDecorationPayment(String orderId, String paymentType) {
		return (DecorationPaymentPO) session().createCriteria(DecorationPaymentPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).add(Restrictions.eq("paymentType", paymentType)).setMaxResults(1).uniqueResult();
	}

	@Override
	public DecorationPaymentPO queryDecorationPayment(String orderId, short sort) {
		return (DecorationPaymentPO) session().createCriteria(DecorationPaymentPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).add(Restrictions.eq("sort", sort)).add(Restrictions.eq("oneType", DecorationPaymentPO.ONETYPE_ADD_INT)).add(Restrictions.eq("twoType", DecorationPaymentPO.TWOTYPE_DEAL_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int changeDecorationPayment(String oldOrderId, String newOrderId) {

		String sql = "update payment.decorationpayment set orderId=:newOrderId where orderId=:oldOrderId";

		session().createSQLQuery(sql).setString("newOrderId", newOrderId).setString("oldOrderId", oldOrderId).executeUpdate();

		return 0;
	}

	@Override
	public long amountDecorationPayment(String orderId, Short[] paymentStatus, short oneType, short twoType) {
		String sql = "SELECT SUM(referMoney) from payment.decorationpayment where orderId = :orderId AND paymentStatus IN :paymentStatus AND onetype = :oneType AND twotype = :twoType";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setParameterList("paymentStatus", paymentStatus).setShort("oneType", oneType).setShort("twoType", twoType).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	@Override
	public int countDecorationPayment(String orderId, List<Short> onetypes, List<Short> twotypes, List<Short> statuses) {

		String sql = "SELECT count(*) from payment.decorationpayment dp where dp.orderId = :orderId ";

		if (onetypes != null && onetypes.size() > 0) {
			sql = sql.concat(" AND dp.onetype IN :onetypes ");
		}

		if (twotypes != null && twotypes.size() > 0) {
			sql = sql.concat(" AND dp.twotype IN :twotypes ");
		}

		if (statuses != null && statuses.size() > 0) {
			sql = sql.concat(" AND dp.paymentStatus IN :statuses ");
		}

		Query query = session().createSQLQuery(sql).setString("orderId", orderId);

		if (onetypes != null && onetypes.size() > 0) {
			query.setParameterList("onetypes", onetypes);
		}

		if (twotypes != null && twotypes.size() > 0) {
			query.setParameterList("twotypes", twotypes);
		}

		if (statuses != null && statuses.size() > 0) {
			query.setParameterList("statuses", statuses);
		}

		return ((BigInteger) query.uniqueResult()).intValue();
	}

	@Override
	public int deleteDecorationPaymentForBase(String orderId) {

		String sql = "delete from payment.decorationpayment where orderId=:orderId and onetype = :onetype and twotype = :twotype";

		return session().createSQLQuery(sql).setString("orderId", orderId).setInteger("onetype", DecorationPaymentPO.ONETYPE_ADD_INT).setInteger("twotype", DecorationPaymentPO.TWOTYPE_DEAL_INT).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<DecorationPaymentPO> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("collectUser".equals(field)) {
				query.alias("decorationReceipt", "decorationReceipt");
				query.alias("decorationReceipt.collecter", "collecter");
				query.add(query.getCriterion("collecter.currentName", data, op));
			} else if ("paymentStatus".equals(field)) {
				query.add(query.getCriterion("paymentStatus", Short.valueOf(data), op));
			} else if ("paymentType".equals(field)) {
				query.add(query.getCriterion("paymentType", data, op));
			} else if ("oneType".equals(field)) {
				query.add(query.getCriterion("oneType", Short.valueOf(data), op));
			} else if ("collectTime".equals(field) && "between".equals(op)) {
				query.alias("decorationReceipt", "decorationReceipt");
				query.timeranges("decorationReceipt.collectTime", "decorationReceipt.collectTime", data);
			} else if ("collectTime".equals(field) && "eq".equals(op)) {
				query.alias("decorationReceipt", "decorationReceipt");
				query.add(query.getCriterion("decorationReceipt.collectTime", data, op));
			} else if ("confirmTime".equals(field)) {
				query.alias("decorationReceipt", "decorationReceipt");
				query.timeranges("decorationReceipt.confirmTime", "decorationReceipt.confirmTime", data);
			} else if ("createTime".equals(field) && "between".equals(op)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("createTime".equals(field) && "eq".equals(op)) {
				query.add(query.getCriterion("createTime", data, op));
			} else if ("company".equals(field)) {
				query.add(query.getCriterion("company", Integer.valueOf(data), op));
			}
		}
	}

}
