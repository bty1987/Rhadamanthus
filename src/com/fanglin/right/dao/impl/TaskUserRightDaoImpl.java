package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.TaskUserRightDao;
import com.fanglin.right.po.TaskUserRightPO;

@Repository("taskUserRightDao")
public class TaskUserRightDaoImpl extends DaoImpl<TaskUserRightPO> implements TaskUserRightDao {

	public TaskUserRightDaoImpl(){
		super(TaskUserRightPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<TaskUserRightPO> queryTaskUserRightByUserId(int uid, int company) {
		
		return session().createCriteria(TaskUserRightPO.class).add(Restrictions.eq("uid", uid)).add(Restrictions.eq("company", company)).list();
	
	}
	
	@Override
	public void deleteTaskUserRightByUid(int uid, int company) {
		
		String sql = "delete from platform.taskuserright where uid = :uid and company = :company";
		
		session().createSQLQuery(sql).setLong("uid", uid).setInteger("company", company).executeUpdate();
		
	}

}
