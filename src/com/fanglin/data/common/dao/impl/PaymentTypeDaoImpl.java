package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.PaymentTypeDao;
import com.fanglin.data.po.PaymentTypePO;
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
	public List<PaymentTypePO> queryPaymentType(Short type, Short paytype, Short bustype, Short atttype, int company) {

		Criteria criteria = session().createCriteria(PaymentTypePO.class).add(Restrictions.eq(PaymentTypePO.COLUMN_STATUS_STR, PaymentTypePO.STATUS_ENABLE_INT)).add(Restrictions.eq(PaymentTypePO.COLUMN_COMPANY_STR, company));

		if (type != null) {
			criteria.add(Restrictions.eq(PaymentTypePO.COLUMN_TYPE_STR, type));
		}

		if (paytype != null) {
			criteria.add(Restrictions.eq(PaymentTypePO.COLUMN_PAYTYPE_STR, paytype));
		}

		if (bustype != null) {
			criteria.add(Restrictions.eq(PaymentTypePO.COLUMN_BUSTYPE_STR, bustype));
		}

		if (atttype != null) {
			criteria.add(Restrictions.eq(PaymentTypePO.COLUMN_ATTTYPE_STR, atttype));
		}

		return criteria.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("type".equals(field)) {
				query.add(query.getCriterion(PaymentTypePO.COLUMN_TYPE_STR, Short.valueOf(data), op));
			} else if ("paytype".equals(field)) {
				query.add(query.getCriterion(PaymentTypePO.COLUMN_PAYTYPE_STR, Short.valueOf(data), op));
			} else if ("bustype".equals(field)) {
				query.add(query.getCriterion(PaymentTypePO.COLUMN_BUSTYPE_STR, Short.valueOf(data), op));
			} else if ("atttype".equals(field)) {
				query.add(query.getCriterion(PaymentTypePO.COLUMN_ATTTYPE_STR, Short.valueOf(data), op));
			} else if ("kiname".equals(field)) {
				query.add(query.getCriterion(PaymentTypePO.COLUMN_KINAME_STR, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(PaymentTypePO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			} else if ("name".equals(field)) {
				query.add(query.getCriterion(PaymentTypePO.COLUMN_NAME_STR, data, op));
			} else if ("company".equals(field)) {
				query.add(query.getCriterion(PaymentTypePO.COLUMN_COMPANY_STR, Integer.valueOf(data), op));
			}
		}
	}
}
