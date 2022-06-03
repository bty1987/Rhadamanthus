package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.PaymentTypeDao;
import com.fanglin.communion.po.PaymentTypePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("paymentTypeDao")
public class PaymentTypeDaoImpl extends DaoImpl<PaymentTypePO> implements PaymentTypeDao {

	public PaymentTypeDaoImpl() {
		super(PaymentTypePO.class);
	}

	@Override
	public List<PaymentTypePO> pagePaymentType(Paging paging, List<Filter> filters) {
		
		PagingQuery<PaymentTypePO> query = pagingQuery(paging, PaymentTypePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentTypePO> queryPaymentType(Short type, Short paytype, Short bustype, Short atttype) {
		
		Criteria criteria = session().createCriteria(PaymentTypePO.class).add(Restrictions.eq(PaymentTypePO.COLUMN_STATUS_INT, PaymentTypePO.STATUS_ENABLE_INT));
		
		if (type != null) {
			criteria.add(Restrictions.eq(PaymentTypePO.COLUMN_TYPE_INT, type));
		}
		
		if (paytype != null) {
			criteria.add(Restrictions.eq(PaymentTypePO.COLUMN_PAYTYPE_INT, paytype));
		}
		
		if (bustype != null) {
			criteria.add(Restrictions.eq(PaymentTypePO.COLUMN_BUSTYPE_INT, bustype));
		}
		
		if (atttype != null) {
			criteria.add(Restrictions.eq(PaymentTypePO.COLUMN_ATTTYPE_INT, atttype));
		}
		
		return criteria.list();
	}

	@Override
	public PaymentTypePO queryPaymentTypeByPtid(Long ptid) {
		return (PaymentTypePO) session().createCriteria(PaymentTypePO.class).add(Restrictions.eq(PaymentTypePO.COLUMN_PTID_INT, ptid)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("paytype".equals(field)) {
				query.add(query.getCriterion("paytype", Short.valueOf(data), op));
			} else if ("bustype".equals(field)) {
				query.add(query.getCriterion("bustype", Short.valueOf(data), op));
			} else if ("atttype".equals(field)) {
				query.add(query.getCriterion("atttype", Short.valueOf(data), op));
			} else if ("kiname".equals(field)) {
				query.add(query.getCriterion("kiname", data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			}
		}
	}

}
