package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.TaskDao;
import com.fanglin.data.po.TaskPO;
import com.fanglin.utils.Paging;

@Repository("taskDao")
public class TaskDaoImpl extends DaoImpl<TaskPO> implements TaskDao {

	public TaskDaoImpl() {
		super(TaskPO.class);
	}

	@Override
	public List<TaskPO> pageTask(Paging paging, List<Filter> filters) {

		PagingQuery<TaskPO> query = pagingQuery(paging, TaskPO.class);

		queryFilterExecute(query, filters);

		query.asc("tid");

		return query.list();
	}

	@Override
	public TaskPO queryTaskByName(String name) {
		return (TaskPO) session().createCriteria(TaskPO.class).add(Restrictions.eq(TaskPO.COLUMN_NAME_STR, name)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<TaskPO> queryTask(short level) {
		return session().createCriteria(TaskPO.class).add(Restrictions.eq("level", level)).add(Restrictions.eq(TaskPO.COLUMN_STATUS_STR, TaskPO.STATUS_ENABLE_INT)).add(Restrictions.eq(TaskPO.COLUMN_SHOW_STR, TaskPO.SHOW_ABLE_INT)).list();
	}

	@Override
	public TaskPO queryTaskByKeyWord(String keyWord) {
		return (TaskPO) session().createCriteria(TaskPO.class).add(Restrictions.eq(TaskPO.COLUMN_STATUS_STR, TaskPO.STATUS_ENABLE_INT)).add(Restrictions.eq(TaskPO.COLUMN_KEYWORD_STR, keyWord)).uniqueResult();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("taskName".equals(field)) {
					query.add(query.getCriterion(TaskPO.COLUMN_NAME_STR, data, op));
				}
				else if("taskIsShow".equals(field)){
					query.add(query.getCriterion(TaskPO.COLUMN_SHOW_STR, Short.valueOf(data), op));
				}
				else if("taskStatus".equals(field)){
					query.add(query.getCriterion(TaskPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
				}else if("taskLevel".equals(field)){
					query.add(query.getCriterion(TaskPO.COLUMN_LEVEL_STR, Short.valueOf(data), op));
				}
			}
		}
	}

}
