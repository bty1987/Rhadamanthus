package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.WorkshopDao;
import com.fanglin.production.po.WorkshopPO;
import com.fanglin.utils.Paging;

@Repository("workshopDao")
public class WorkshopDaoImpl extends DaoImpl<WorkshopPO> implements WorkshopDao {

	public WorkshopDaoImpl() {
		super(WorkshopPO.class);
	}

	@Override
	public List<WorkshopPO> pageWorkshop(Paging paging, List<Filter> filters, int company) {

		PagingQuery<WorkshopPO> query = pagingQuery(paging, WorkshopPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkshopPO> queryWorkshop(int company) {
		return createCriteria(WorkshopPO.class).add(Restrictions.eq(WorkshopPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq("status", WorkshopPO.STATUS_ENABLE_SHORT)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if (WorkshopPO.COLUMN_NAME_STR.equals(field)) {
					query.add(query.getCriterion(field, data, op));
				}
			}
		}
	}

}
