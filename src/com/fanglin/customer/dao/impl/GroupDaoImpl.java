package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.GroupDao;
import com.fanglin.customer.po.GroupPO;
import com.fanglin.utils.Paging;

@Repository("groupDao")
public class GroupDaoImpl extends DaoImpl<GroupPO> implements GroupDao {

	public GroupDaoImpl() {
		super(GroupPO.class);
	}

	@Override
	public List<GroupPO> pageGroup(Paging paging, List<Filter> filters) {

		PagingQuery<GroupPO> query = pagingQuery(paging, GroupPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public GroupPO queryGroup(String opengid) {
		return (GroupPO) createCriteria(GroupPO.class).add(Restrictions.eq(GroupPO.COLUMN_OPENGID_STR, opengid)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<GroupPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String op = filter.getOp();
			String data = filter.getData();

			if (field.equals("name")) {
				query.add(query.getCriterion("name", data, op));
			} else if (field.equals("orderId")) {
				query.add(query.getCriterion("orderId", data, op));
			}
		}
	}

}
