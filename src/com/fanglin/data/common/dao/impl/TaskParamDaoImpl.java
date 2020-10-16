package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.TaskParamDao;
import com.fanglin.data.po.TaskParamPO;
import com.fanglin.utils.Paging;

@Repository("taskParamDao")
public class TaskParamDaoImpl extends DaoImpl<TaskParamPO> implements TaskParamDao {
	
	public TaskParamDaoImpl() {
		super(TaskParamPO.class);
	}
	
	@Override
	public List<TaskParamPO> pageTaskParam(Paging paging, List<Filter> filters) {
		
		PagingQuery<TaskParamPO> query = pagingQuery(paging, TaskParamPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<TaskParamPO> queryTaskParam(Long tid) {
		return session().createCriteria(TaskParamPO.class).add(Restrictions.eq("tid", tid)).add(Restrictions.eq("status", TaskParamPO.STATUS_INIT_SHORT)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String op = filter.getOp();
				String data = filter.getData();

				if (field.equals("module")) {
					query.add(query.getCriterion("module", data, op));
				}
			}
		}
	}
}
