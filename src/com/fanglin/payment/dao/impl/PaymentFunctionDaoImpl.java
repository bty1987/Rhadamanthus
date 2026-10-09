package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.PaymentFunctionDao;
import com.fanglin.payment.po.PaymentFunctionPO;
import com.fanglin.right.po.PaymentFunctionRightPO;
import com.fanglin.utils.Paging;

@Repository("paymentFunctionDao")
public class PaymentFunctionDaoImpl extends DaoImpl<PaymentFunctionPO> implements PaymentFunctionDao {

	public PaymentFunctionDaoImpl(){
		super(PaymentFunctionPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentFunctionPO> pagePaymentFunction(Paging paging, List<Filter> filters) {
		PagingQuery<PaymentFunctionPO> query = pagingQuery(paging, PaymentFunctionPO.class);

		queryFilterExcute(query, filters);

		query.asc("sort").asc("pfid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("key".equals(field)) {
				query.add(query.getCriterion("key", data, op));
			} else if ("group".equals(field)) {
				query.add(query.getCriterion("group", data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", data, op));
			} else if ("subtype".equals(field)) {
				query.add(query.getCriterion("subtype", data, op));
			}
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentFunctionPO> queryPaymentFunction(Short type) {

		Criteria criteria = session().createCriteria(PaymentFunctionPO.class).add(Restrictions.eq("status", PaymentFunctionPO.STATUS_ENABLE_INT));

		if(type != null){
			criteria.add(Restrictions.eq("type", type));
		}

		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentFunctionPO> queryPaymentFunctionByName(String name) {
		return session().createCriteria(PaymentFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public long countPaymentFunctionRightByPfid(long pfid) {
		return ((Number) session().createQuery("select count(*) from PaymentFunctionRightPO where paymentFunction.pfid = :pfid").setParameter("pfid", pfid).uniqueResult()).longValue();
	}

}
