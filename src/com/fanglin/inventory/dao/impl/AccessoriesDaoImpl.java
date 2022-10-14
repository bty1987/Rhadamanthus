package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.AccessoriesDao;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.utils.Paging;

@Repository("accessoriesDao")
public class AccessoriesDaoImpl extends DaoImpl<AccessoriesPO> implements AccessoriesDao {

	public AccessoriesDaoImpl() {
		super(AccessoriesPO.class);
	}

	@Override
	public List<AccessoriesPO> pageAccessories(Paging paging, List<Filter> filters, int company) {

		PagingQuery<AccessoriesPO> query = pagingQuery(paging, AccessoriesPO.class);

		query.add(query.getCriterion(AccessoriesPO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("aid");

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<AccessoriesPO> queryAccessoriesByOrderId(String orderId) {
		return session().createCriteria(AccessoriesPO.class).add(Restrictions.eq(AccessoriesPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null || filters.size() == 0) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("createrName".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion(AccessoriesPO.COLUMN_CREATER_USERID_STR, data, op));
			} else if ("approverName".equals(field)) {
				query.alias("approver", "approver");
				query.add(query.getCriterion(AccessoriesPO.COLUMN_APPROVER_USERID_STR, data, op));
			} else if ("userId".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion(AccessoriesPO.COLUMN_CREATER_USERID_STR, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(AccessoriesPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			} else if (AccessoriesPO.COLUMN_ORDERID_STR.equals(field)) {
				query.add(query.getCriterion(AccessoriesPO.COLUMN_ORDERID_STR, data, op));
			} else if (AccessoriesPO.COLUMN_NO_STR.equals(field)) {
				query.add(query.getCriterion(AccessoriesPO.COLUMN_NO_STR, data, op));
			} else if (AccessoriesPO.COLUMN_CREATETIME_STR.equals(field)) {
				query.timeranges(AccessoriesPO.COLUMN_CREATETIME_STR, data);
			} else if (AccessoriesPO.COLUMN_APPROVERTIME_STR.equals(field)) {
				query.timeranges(AccessoriesPO.COLUMN_APPROVERTIME_STR, data);
			}
		}
	}

}
