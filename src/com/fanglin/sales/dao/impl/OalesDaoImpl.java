package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.utils.Paging;

@Repository("oalesDao")
public class OalesDaoImpl extends DaoImpl<OalesPO> implements OalesDao {

	public OalesDaoImpl() {
		super(OalesPO.class);
	}

	@Override
	public List<OalesPO> pageOales(Paging paging, List<Filter> filters) {

		PagingQuery<OalesPO> query = pagingQuery(paging, OalesPO.class);

		queryFilterExecute(query, filters);

		query.desc("oid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesPO> querySurveyByOrderId(String orderId) {
		return session().createCriteria(OalesPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			} else if ("createTimeOales".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("oalesBrand".equals(field)) {
				query.add(query.getCriterion("brand", data, op));
			} else if ("oalesCategory".equals(field)) {
				query.add(query.getCriterion("category", data, op));
			}
		}
	}

}
