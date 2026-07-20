package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserCompanyDao;
import com.fanglin.personel.po.UserCompanyPO;

@Repository("userCompanyDao")
public class UserCompanyDaoImpl extends DaoImpl<UserCompanyPO> implements UserCompanyDao {

	public UserCompanyDaoImpl() {
		super(UserCompanyPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserCompanyPO> queryUserCompany(int uid) {
		return session().createCriteria(UserCompanyPO.class).add(Restrictions.eq("uid", uid)).list();
	}

	@Override
	public UserCompanyPO queryUserCompany(int uid, int company) {
		return (UserCompanyPO) session().createCriteria(UserCompanyPO.class).add(Restrictions.eq("uid", uid)).add(Restrictions.eq("company.cid", company)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteUserCompany(int uid) {

		String sql = "delete from communion.usercompany where uid= :uid";
		session().createSQLQuery(sql).setInteger("uid", uid).executeUpdate();

		return 0;
	}

}
