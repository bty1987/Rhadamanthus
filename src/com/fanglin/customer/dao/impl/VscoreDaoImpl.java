package com.fanglin.customer.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.VscoreDao;
import com.fanglin.customer.po.VscorePO;

@Repository("vscoreDao")
public class VscoreDaoImpl extends DaoImpl<VscorePO> implements VscoreDao {

	public VscoreDaoImpl() {
		super(VscorePO.class);
	}

	@Override
	public VscorePO queryVscoreByUnionId(String unionId) {
		return (VscorePO) session().createCriteria(VscorePO.class).add(Restrictions.eq(VscorePO.COLUMN_UNIONID_STR, unionId)).setMaxResults(1).uniqueResult();
	}

}
