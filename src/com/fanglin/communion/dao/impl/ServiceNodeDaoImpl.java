package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.ServiceNodeDao;
import com.fanglin.communion.po.ServiceNodePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("serviceNodeDao")
public class ServiceNodeDaoImpl extends DaoImpl<ServiceNodePO> implements ServiceNodeDao {

	public ServiceNodeDaoImpl() {
		super(ServiceNodePO.class);
	}

	@Override
	public List<ServiceNodePO> pageServiceNode(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ServiceNodePO> query = pagingQuery(paging, ServiceNodePO.class);
		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("type".equals(field)) {
					query.add(query.getCriterion("type", Short.valueOf(data), op));
				}

			}

		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ServiceNodePO> queryServiceNodeByType(short type) {

		return session().createCriteria(ServiceNodePO.class).add(Restrictions.eq("type", type)).add(Restrictions.eq("status", ServiceNodePO.SERVICESTATUS_ENABLE_INT)).list();
	}
}