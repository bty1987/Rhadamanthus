package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.WorkflowDao;
import com.fanglin.production.po.WorkflowPO;
import com.fanglin.utils.Paging;
@Repository("workflowDao")
public class WorkflowDaoImpl  extends DaoImpl<WorkflowPO> implements WorkflowDao{
	
	public WorkflowDaoImpl() {
		super(WorkflowPO.class);
	}
	
	@Override
	public List<WorkflowPO> pageWorkflow(Paging paging, List<Filter> filter,int company) {
		
		PagingQuery<WorkflowPO> query = pagingQuery(paging,WorkflowPO.class);
		query.add(Restrictions.eq("company",company));
		queryFilterExcute(query, filter);
		
		return query.list();
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WorkflowPO> queryWorkflow(int Company) {

		return session().createCriteria(WorkflowPO.class).add(Restrictions.eq("company",Company)).add(Restrictions.eq("status",WorkflowPO.COLUMN_STATUS_STR)).list();

	}

	private void queryFilterExcute(PagingQuery<WorkflowPO> query,List<Filter> filter) {
		
		if (filter != null) {
			for (Filter filters : filter) {
				String filet = filters.getField();
				String data = filters.getData();
				String op = filters.getOp();
				
				if ("name".equals(filet)) {
					query.add(query.getCriterion(WorkflowPO.COLUMN_NAME_STR,data, op));
				}  
				
			}
		}
		
	}
}
