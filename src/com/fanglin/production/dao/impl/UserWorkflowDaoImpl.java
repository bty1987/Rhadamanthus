package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.UserWorkflowDao;
import com.fanglin.production.po.UserWorkflowPO;

@Repository("userWorkflowDao")
public class UserWorkflowDaoImpl extends DaoImpl<UserWorkflowPO> implements UserWorkflowDao {

	public UserWorkflowDaoImpl() {
		super(UserWorkflowPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserWorkflowPO> queryUserWorkflowByUid(long uid) {
		return session().createCriteria(UserWorkflowPO.class).add(Restrictions.eq(UserWorkflowPO.COLUMN_UID_STR, uid)).list();
	}

	@Override
	public int deleteUserWorkflowByUId(long uid) {
		
		String sql = "delete from production.userworkflow where uid = :uid";
		session().createSQLQuery(sql).setLong("uid", uid).executeUpdate();
		
		return 0;
	}

}
