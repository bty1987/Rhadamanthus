package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.construction.dao.DrawlineProfileDao;
import com.fanglin.construction.po.DrawlineProfilePO;
import com.fanglin.utils.Paging;

@Repository("drawlineProfileDao")
public class DrawlineProfileDaoImpl extends DaoImpl<DrawlineProfilePO> implements DrawlineProfileDao {

	public DrawlineProfileDaoImpl() {
		super(DrawlineProfilePO.class);
	}

	@Override
	public List<DrawlineProfilePO> pageDrawlineProfile(Paging paging, List<Filter> filters, int company) {

		PagingQuery<DrawlineProfilePO> query = pagingQuery(paging, DrawlineProfilePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		query.desc("dpid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DrawlineProfilePO> queryDrawlineProfileByDlid(long dlid, Short type) {

		Criteria query = session().createCriteria(DrawlineProfilePO.class).add(Restrictions.eq("dlid", dlid));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DrawlineProfilePO> queryDrawlineProfileByOrderId(String orderId, Short type) {

		Criteria query = session().createCriteria(DrawlineProfilePO.class).add(Restrictions.eq("orderId", orderId));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			} else if ("dlid".equals(field)) {
				query.add(query.getCriterion("dlid", data, op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			}
		}
	}

}
