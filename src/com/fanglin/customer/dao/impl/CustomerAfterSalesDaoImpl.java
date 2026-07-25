package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerAfterSalesDao;
import com.fanglin.customer.po.CustomerAfterSalesPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Repository("customerAfterSalesDao")
public class CustomerAfterSalesDaoImpl extends DaoImpl<CustomerAfterSalesPO> implements CustomerAfterSalesDao {

	public CustomerAfterSalesDaoImpl() {
		super(CustomerAfterSalesPO.class);
	}

	@Override
	public List<CustomerAfterSalesPO> pageCustomerAfterSales(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<CustomerAfterSalesPO> query = pagingQuery(paging, CustomerAfterSalesPO.class);

		if (company != CompanyPO.TYPE_HEADQUARTER_INT) {
			query.add(Restrictions.eq("company", company));
		}

		queryFilterExcute(query, filters);

		query.desc("asid");

		return query.list();
	}

	@Override
	public CustomerAfterSalesPO queryCustomerAfterSalesByAsNo(String asNo) {
		return (CustomerAfterSalesPO) session().createCriteria(CustomerAfterSalesPO.class).add(Restrictions.eq(CustomerAfterSalesPO.COLUMN_ASNO_STR, asNo)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerAfterSalesPO> queryCustomerAfterSalesByOrderId(String orderId, int company) {

		org.hibernate.Criteria query = session().createCriteria(CustomerAfterSalesPO.class).add(Restrictions.eq(CustomerAfterSalesPO.COLUMN_ORDERID_STR, orderId));

		if (company != CompanyPO.TYPE_HEADQUARTER_INT) {
			query.add(Restrictions.eq("company", company));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerAfterSalesPO> queryCustomerAfterSalesByCid(long cid, int company) {

		org.hibernate.Criteria query = session().createCriteria(CustomerAfterSalesPO.class).add(Restrictions.eq(CustomerAfterSalesPO.COLUMN_CID_STR, cid));

		if (company != CompanyPO.TYPE_HEADQUARTER_INT) {
			query.add(Restrictions.eq("company", company));
		}

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<CustomerAfterSalesPO> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (CustomerAfterSalesPO.COLUMN_ASNO_STR.equals(field)) {
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_ASNO_STR, data, op));
			} else if (CustomerAfterSalesPO.COLUMN_ORDERID_STR.equals(field)) {
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_ORDERID_STR, data, op));
			} else if (CustomerAfterSalesPO.COLUMN_CSID_STR.equals(field)) {
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_CSID_STR, Long.valueOf(data), op));
			} else if (CustomerAfterSalesPO.COLUMN_CID_STR.equals(field)) {
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_CID_STR, Long.valueOf(data), op));
			} else if (CustomerAfterSalesPO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_TYPE_STR, Short.valueOf(data), op));
			} else if (CustomerAfterSalesPO.COLUMN_SOURCE_STR.equals(field)) {
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_SOURCE_STR, Short.valueOf(data), op));
			} else if (CustomerAfterSalesPO.COLUMN_PRIORITY_STR.equals(field)) {
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_PRIORITY_STR, Short.valueOf(data), op));
			} else if (CustomerAfterSalesPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			} else if ("owner".equals(field)) {
				query.alias("owner", "owner");
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_OWNER_USERID_STR, data, op));
			} else if ("creater".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion(CustomerAfterSalesPO.COLUMN_CREATER_USERID_STR, data, op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("receiveTime".equals(field)) {
				query.timeranges("receiveTime", "receiveTime", data);
			} else if ("handleTime".equals(field)) {
				query.timeranges("handleTime", "handleTime", data);
			} else if ("finishTime".equals(field)) {
				query.timeranges("finishTime", "finishTime", data);
			} else if ("company".equals(field) && FormatUtil.decodeCompany(data) == CompanyPO.TYPE_HEADQUARTER_INT) {
				query.add(query.getCriterion("company", FormatUtil.decodeCompany(data), op));
			}
		}
	}

}
