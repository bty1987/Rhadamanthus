package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CityProperPartnerDao;
import com.fanglin.communion.po.CityProperPartnerPO;
import com.fanglin.communion.po.DepartmentPartnerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("cityProperPartnerDao")
public class CityProperPartnerDaoImpl extends DaoImpl<CityProperPartnerPO> implements CityProperPartnerDao {

	public CityProperPartnerDaoImpl() {
		super(CityProperPartnerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CityProperPartnerPO> queryCityProperPartner(int cpid) {
		return session().createCriteria(CityProperPartnerPO.class).add(Restrictions.eq("cpid", cpid)).list();
	}

	@Override
	public CityProperPartnerPO queryCityProperPartner(int cpid, short type) {
		return (CityProperPartnerPO) session().createCriteria(DepartmentPartnerPO.class).add(Restrictions.eq("cpid", cpid)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

}
