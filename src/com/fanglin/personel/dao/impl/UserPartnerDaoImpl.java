package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.UserPartnerDao;
import com.fanglin.personel.po.UserPartnerPO;

@Repository("UserPartnerDao")
public class UserPartnerDaoImpl extends DaoImpl<UserPartnerPO> implements UserPartnerDao {

	public UserPartnerDaoImpl() {
		super(UserPartnerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPartnerPO> queryUserPartner(int uid) {
		return session().createCriteria(UserPartnerPO.class).add(Restrictions.eq("uid", uid)).list();
	}

	@Override
	public UserPartnerPO queryUserPartner(int uid, short type, int company) {
		return (UserPartnerPO) session().createCriteria(UserPartnerPO.class).add(Restrictions.eq("uid", uid)).add(Restrictions.eq("type", type)).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<UserPartnerPO> queryUserPartnerByUid(int uid, short type, int company) {
		return session().createCriteria(UserPartnerPO.class).add(Restrictions.eq("uid", uid)).add(Restrictions.eq("type", type)).add(Restrictions.eq("company", company)).list();
	}

	@Override
	public UserPartnerPO queryUserPartnerByPuid(int puid, short type, int company) {
		return (UserPartnerPO) session().createCriteria(UserPartnerPO.class).add(Restrictions.eq("partner.uid", puid)).add(Restrictions.eq("type", type)).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

}
