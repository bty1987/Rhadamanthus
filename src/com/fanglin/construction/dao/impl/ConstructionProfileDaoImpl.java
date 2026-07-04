package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.construction.dao.ConstructionProfileDao;
import com.fanglin.construction.po.ConstructionProfilePO;
import com.fanglin.utils.Paging;

@Repository("constructionProfileDao")
public class ConstructionProfileDaoImpl extends DaoImpl<ConstructionProfilePO> implements ConstructionProfileDao {

	public ConstructionProfileDaoImpl() {
		super(ConstructionProfilePO.class);
	}

	@Override
	public List<ConstructionProfilePO> pageConstructionProfile(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ConstructionProfilePO> query = pagingQuery(paging, ConstructionProfilePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		query.desc("cpid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionProfilePO> queryConstructionProfileByCid(long cid, Short type) {

		Criteria query = session().createCriteria(ConstructionProfilePO.class).add(Restrictions.eq("cid", cid));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionProfilePO> queryConstructionProfileByOrderId(String orderId, Short type) {

		Criteria query = session().createCriteria(ConstructionProfilePO.class).add(Restrictions.eq("orderId", orderId));

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
			} else if ("cid".equals(field)) {
				query.add(query.getCriterion("cid", data, op));
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
