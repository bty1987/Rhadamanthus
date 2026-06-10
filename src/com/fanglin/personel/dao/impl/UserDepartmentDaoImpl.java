package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserDepartmentDao;
import com.fanglin.personel.po.UserDepartmentPO;

@Repository("userDepartmentDao")
public class UserDepartmentDaoImpl extends DaoImpl<UserDepartmentPO> implements UserDepartmentDao {

	public UserDepartmentDaoImpl() {
		super(UserDepartmentPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserDepartmentPO> queryUserDepartment(int uid) {
		return session().createCriteria(UserDepartmentPO.class).add(Restrictions.eq("uid", uid)).list();
	}

	@Override
	public int deleteUserDepartment(int uid) {

		String sql = "delete from communion.userdepartment where uid= :uid";
		session().createSQLQuery(sql).setInteger("uid", uid).executeUpdate();

		return 0;
	}

}
