package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.UserFunctionRightDao;
import com.fanglin.right.po.UserFunctionRightPO;

@Repository("userFunctionRightDao")
public class UserFunctionRightDaoImpl extends DaoImpl<UserFunctionRightPO> implements UserFunctionRightDao {

	public UserFunctionRightDaoImpl() {
		super(UserFunctionRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserFunctionRightPO> queryUserFunctionRight(String name) {
		return session().createCriteria(UserFunctionRightPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public int deleteUserFunctionRightByName(String name) {

		String sql = "delete from platform.userfunctionright where name = :name";
		session().createSQLQuery(sql).setString("name", name).executeUpdate();

		return 0;
	}

}
