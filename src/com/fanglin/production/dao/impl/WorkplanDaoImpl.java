package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.WorkplanDao;
import com.fanglin.production.po.WorkplanPO;
import com.fanglin.utils.Paging;

@Repository("workplanDao")
public class WorkplanDaoImpl extends DaoImpl<WorkplanPO> implements WorkplanDao {

	public WorkplanDaoImpl() {
		super(WorkplanPO.class);
	}

	@Override
	public List<WorkplanPO> pageWorkplan(Paging paging, List<Filter> filters, int company) {

		PagingQuery<WorkplanPO> query = pagingQuery(paging, WorkplanPO.class);

		queryFilterExcute(query, filters);
		
		query.add(Restrictions.eq(WorkplanPO.COLUMN_COMPANY_STR, company));
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkplanPO> queryWorkplanByWsid(long wsid, int company) {
		return session().createCriteria(WorkplanPO.class).add(Restrictions.eq(WorkplanPO.COLUMN_COMPANY_STR, company)).createAlias("workshop", "workshop").add(Restrictions.eq("workshop.wsid", wsid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkplanPO> queryWorkplan(int company) {
		return session().createCriteria(WorkplanPO.class).add(Restrictions.eq(WorkplanPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq("status", WorkplanPO.COLUMN_STATUS_SHORT)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if (WorkplanPO.COLUMN_NAME_STR.equals(field)) {
					query.add(query.getCriterion(WorkplanPO.COLUMN_NAME_STR, data, op));
				}
			}
		}
	}
	
}
