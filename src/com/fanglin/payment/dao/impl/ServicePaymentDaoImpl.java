package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.payment.dao.ServicePaymentDao;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.utils.Paging;

@Repository("servicePaymentDao")
public class ServicePaymentDaoImpl extends DaoImpl<ServicePaymentPO> implements ServicePaymentDao {

	public ServicePaymentDaoImpl() {
		super(ServicePaymentPO.class);
	}

	@Override
	public List<ServicePaymentPO> pageServicePayment(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<ServicePaymentPO> query = pagingQuery(paging, ServicePaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ServicePaymentPO> queryServicePaymentByOrderId(String orderId) {
		return session().createCriteria(ServicePaymentPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ServicePaymentPO> queryServicePaymentForNotInitBySrId(long srId) {
		return session().createCriteria(ServicePaymentPO.class).createAlias("serviceReceipt", "serviceReceipt").add(Restrictions.eq("serviceReceipt.srId", srId)).add(Restrictions.ne("status", ServicePaymentPO.COLUMN_INITIALSTATUS_INT)).list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("collectTime".equals(field)) {
				query.alias("serviceReceipt", "servicereceipt");

				if ("between".equals(filter.getOp())) {
					query.timeranges("servicereceipt.collectTime", "servicereceipt.collectTime", data);
				} else {
					query.add(query.getCriterion("servicereceipt.collectTime", data, op));
				}
			} else if ("confirmTime".equals(field)) {
				query.alias("serviceReceipt", "servicereceipt");
				query.timeranges("servicereceipt.confirmTime", "servicereceipt.confirmTime", data);
			} else if ("company".equals(field)) {
				query.add(query.getCriterion(field, Integer.valueOf(data), op));
			}
		}
	}

}
