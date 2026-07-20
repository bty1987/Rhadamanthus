package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.DutmentDao;
import com.fanglin.personel.po.DutmentPO;

@Repository("dutmentDao")
public class DutmentDaoImpl extends DaoImpl<DutmentPO> implements DutmentDao {

	public DutmentDaoImpl() {
		super(DutmentPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DutmentPO> queryDutmentByDeid(Integer did) {
		return session().createCriteria(DutmentPO.class).createAlias("dept", "dept").add(Restrictions.eq("dept.did", did)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DutmentPO> queryDutmentByDuid(Long did) {
		return session().createCriteria(DutmentPO.class).createAlias("duty", "duty").add(Restrictions.eq("duty.did", did)).list();
	}

	@Override
	public DutmentPO queryDutmentByDids(Integer deid, Long did) {
		return (DutmentPO) session().createCriteria(DutmentPO.class).createAlias("duty", "duty").createAlias("dept", "dept").add(Restrictions.eq("duty.did", did)).add(Restrictions.eq("dept.did", deid)).setMaxResults(1).uniqueResult();
	}

}
