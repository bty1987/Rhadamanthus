package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.FlowpathDao;
import com.fanglin.data.po.FlowpathPO;
import com.fanglin.utils.Paging;

@Repository("flowpathDao")
public class FlowpathDaoImpl extends DaoImpl<FlowpathPO> implements FlowpathDao {

	public FlowpathDaoImpl() {
		super(FlowpathPO.class);
	}

	@Override
	public List<FlowpathPO> pageFlowpath(Paging paging, List<Filter> filters) {

		PagingQuery<FlowpathPO> query = pagingQuery(paging, FlowpathPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FlowpathPO> queryFlowpath(long fpid, String keyword) {
		return session().createCriteria(FlowpathPO.class).add(Restrictions.eq("fpid", fpid)).add(Restrictions.eq("keyword", keyword)).list();
	}

	private void queryFilterExcute(PagingQuery<FlowpathPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			if ("status".equals(filter.getField())) {
				query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
			}
		}
	}

}
