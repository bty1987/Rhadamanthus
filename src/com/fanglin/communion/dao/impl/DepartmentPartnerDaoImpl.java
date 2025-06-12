package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.DepartmentPartnerDao;
import com.fanglin.communion.po.DepartmentPartnerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("DepartmentPartnerDao")
public class DepartmentPartnerDaoImpl extends DaoImpl<DepartmentPartnerPO> implements DepartmentPartnerDao {

	public DepartmentPartnerDaoImpl() {
		super(DepartmentPartnerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DepartmentPartnerPO> queryDepartmentPartner(int did) {
		return session().createCriteria(DepartmentPartnerPO.class).add(Restrictions.eq("did", did)).list();
	}

	@Override
	public DepartmentPartnerPO queryDepartmentPartner(int did, short type) {
		return (DepartmentPartnerPO) session().createCriteria(DepartmentPartnerPO.class).add(Restrictions.eq("did", did)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

}
