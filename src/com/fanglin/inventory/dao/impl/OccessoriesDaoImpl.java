package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.OccessoriesDao;
import com.fanglin.inventory.po.OccessoriesPO;
import com.fanglin.utils.Paging;

@Repository("occessoriesDao")
public class OccessoriesDaoImpl extends DaoImpl<OccessoriesPO> implements OccessoriesDao {

	public OccessoriesDaoImpl() {
		super(OccessoriesPO.class);
	}

	@Override
	public List<OccessoriesPO> pageOccessories(Paging paging, List<Filter> filters, Short status, int company) {

		PagingQuery<OccessoriesPO> query = pagingQuery(paging, OccessoriesPO.class);

		query.add(query.getCriterion(OccessoriesPO.COLUMN_COMPANY_STR, company, "eq"));

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		queryFilterExcute(query, filters);

		query.desc("oid");

		return query.list();
	}

	@Override
	public List<OccessoriesPO> pageOccessoriesForSupplier(Paging paging, List<Filter> filters, int uid) {

		PagingQuery<OccessoriesPO> query = pagingQuery(paging, OccessoriesPO.class);

		query.alias("supplier", "supplier");

		query.add(query.getCriterion("supplier.uid", uid, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<OccessoriesPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("createrName".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion("creater.userId", data, op));
			} else if ("orderId".equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion("decoration.orderId", data, op));
			} else if ("no".equals(field)) {
				query.add(query.getCriterion("no", data, op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("deliveTime".equals(field)) {
				query.timeranges("deliveTime", data);
			} else if ("receiveTime".equals(field)) {
				query.timeranges("receiveTime", data);
			} else if ("balanceTime".equals(field)) {
				query.timeranges("balanceTime", data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("isEnter".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("isLift".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}
}
