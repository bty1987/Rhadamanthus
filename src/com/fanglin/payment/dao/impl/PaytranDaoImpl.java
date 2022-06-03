package com.fanglin.payment.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.PaytranDao;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.utils.Paging;

@Repository("paytranDao")
public class PaytranDaoImpl extends DaoImpl<PaytranPO> implements PaytranDao {

	public PaytranDaoImpl() {
		super(PaytranPO.class);
	}

	@Override
	public List<PaytranPO> pagePaytran(Paging paging, List<Filter> filters) {

		PagingQuery<PaytranPO> query = pagingQuery(paging, PaytranPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaytranPO> queryPaytran(String orderId, Short type, Long rid, Long pid) {

		Criteria criteria = session().createCriteria(PaytranPO.class);

		if (orderId != null) {
			criteria.add(Restrictions.eq("orderId", orderId));
		}

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		if (rid != null) {
			criteria.add(Restrictions.eq("rid", rid));
		}

		if (pid != null) {
			criteria.add(Restrictions.eq("pid", pid));
		}

		return criteria.list();
	}

	@Override
	public void updatePaytran(List<Long> ptids, Long rid, Short status, Short type) {

		String sql = "update payment.paytran set status = :status, rid = :rid, type = :type where ptid in :ptids";

		session().createSQLQuery(sql).setShort("status", status).setLong("rid", rid).setShort("type", type).setParameterList("ptids", ptids).executeUpdate();
	}

	@Override
	public long countPaytran(String sn, Short status) {

		String sql = "select count(*) from payment.paytran where sn = :sn and status = :status";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setString("sn", sn).setShort("status", status).uniqueResult();

		return num.longValue();
	}

	@Override
	public int countPaytranByPtids(List<Long> ptids) {

		String sql = "select count(*) from payment.paytran where ptid in :ptids and status != :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setParameterList("ptids", ptids).setShort("status", PaytranPO.STATUS_SUCCESS_INT).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {

			query.alias("creater", "creater");

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("sn".equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if ("paymentType".equals(field)) {
					query.add(query.getCriterion("type", Short.valueOf(data), op));
				} else if ("createTime".equals(field)) {
					query.timeranges(field, field, data);
				} else if ("status".equals(field)) {
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				} else if ("creater".equals(field)) {
					query.add(Restrictions.eq("creater.userId", data));
				}
			}
		}
	}

}
