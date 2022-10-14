package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.TaskRoleRightDao;
import com.fanglin.right.po.TaskRoleRightPO;

@Repository("taskRoleRightDao")
public class TaskRoleRightDaoImpl extends DaoImpl<TaskRoleRightPO> implements TaskRoleRightDao {

	public TaskRoleRightDaoImpl() {
		super(TaskRoleRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<TaskRoleRightPO> queryTaskRoleRight(int rid) {
		return session().createCriteria(TaskRoleRightPO.class).add(Restrictions.eq("rid", rid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<TaskRoleRightPO> queryTaskRoleRight(List<Integer> rids) {
		return session().createCriteria(TaskRoleRightPO.class).add(Restrictions.in("rid", rids)).list();
	}

	@Override
	public void deleteTaskRoleRight(int rid) {

		String sql = "DELETE FROM `data`.taskroleright WHERE rid = :rid";

		session().createSQLQuery(sql).setLong("rid", rid).executeUpdate();
	}

}
