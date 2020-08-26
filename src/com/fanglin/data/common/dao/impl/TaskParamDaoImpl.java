package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.TaskParamDao;
import com.fanglin.data.po.TaskParamPO;

@Repository("taskParamDao")
public class TaskParamDaoImpl extends DaoImpl<TaskParamPO> implements TaskParamDao {
	
	public TaskParamDaoImpl() {
		super(TaskParamPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<TaskParamPO> queryTaskParam(long tid) {
		
		return session().createCriteria(TaskParamPO.class).add(Restrictions.eq("tid", tid)).list();
		
	}

}
