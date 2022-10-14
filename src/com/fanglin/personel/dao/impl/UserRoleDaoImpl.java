package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserRoleDao;
import com.fanglin.personel.po.UserRolePO;

@Repository("UserRoleDao")
public class UserRoleDaoImpl extends DaoImpl<UserRolePO> implements UserRoleDao {

	public UserRoleDaoImpl() {
		super(UserRolePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserRolePO> queryUserRole(int uid) {
		return session().createCriteria(UserRolePO.class).add(Restrictions.eq("uid", uid)).list();
	}

	@Override
	public int deleteUserRole(int uid) {

		String sql = "delete from communion.userrole where uid= :uid";
		session().createSQLQuery(sql).setInteger("uid", uid).executeUpdate();

		return 0;
	}

}
