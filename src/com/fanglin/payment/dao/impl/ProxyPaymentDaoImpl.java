package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.ProxyPaymentDao;
import com.fanglin.payment.po.ProxyPaymentPO;
import com.fanglin.utils.Paging;

@Repository("proxyPaymentDao")
public class ProxyPaymentDaoImpl extends DaoImpl<ProxyPaymentPO> implements ProxyPaymentDao {

	public ProxyPaymentDaoImpl() {
		super(ProxyPaymentPO.class);
	}

	@Override
	public List<ProxyPaymentPO> pageProxyPayment(Paging paging, List<Filter> filters) {

		PagingQuery<ProxyPaymentPO> query = pagingQuery(paging, ProxyPaymentPO.class);

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProxyPaymentPO> queryProxyPaymentByPpids(List<Long> ppids) {
		return session().createCriteria(ProxyPaymentPO.class).add(Restrictions.in("ppid", ppids)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("name")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("phone")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("creater")) {
				query.alias("creater", "creater");
				query.add(query.getCriterion(ProxyPaymentPO.COLUMN_CREATER_STR, data, op));
			} else if (field.equals("type")) {
				query.add(query.getCriterion(ProxyPaymentPO.COLUMN_TYPE_STR, Short.valueOf(data), op));
			} else if (field.equals("status")) {
				query.add(query.getCriterion(ProxyPaymentPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			} else if (field.equals("collectTime")) {

				query.alias("proxyReceipt", "proxyReceipt");

				if ("between".equals(op)) {
					query.timeranges(ProxyPaymentPO.COLUMN_COLLECTTIME_STR, ProxyPaymentPO.COLUMN_COLLECTTIME_STR, filter.getData());
				} else {
					query.add(query.getCriterion(ProxyPaymentPO.COLUMN_COLLECTTIME_STR, filter.getData(), filter.getOp()));
				}
			} else if (field.equals("confirmTime")) {

				query.alias("proxyReceipt", "proxyReceipt");

				if ("between".equals(op)) {
					query.timeranges(ProxyPaymentPO.COLUMN_CONFIRMTIME_STR, ProxyPaymentPO.COLUMN_CONFIRMTIME_STR, filter.getData());
				} else {
					query.add(query.getCriterion(ProxyPaymentPO.COLUMN_CONFIRMTIME_STR, filter.getData(), filter.getOp()));
				}
			} else if (field.equals("createTime")) {

				if ("between".equals(op)) {
					query.timeranges(ProxyPaymentPO.COLUMN_CREATETIME_STR, ProxyPaymentPO.COLUMN_CREATETIME_STR, filter.getData());
				} else {
					query.add(query.getCriterion(ProxyPaymentPO.COLUMN_CREATETIME_STR, filter.getData(), filter.getOp()));
				}
			} else if (field.equals("isexpire")) {
				query.add(query.getCriterion(ProxyPaymentPO.COLUMN_ISEXPIRE_STR, Short.valueOf(data), op));
			}
		}
	}
}
