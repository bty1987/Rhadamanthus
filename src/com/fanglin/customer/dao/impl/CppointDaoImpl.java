package com.fanglin.customer.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CppointDao;
import com.fanglin.customer.po.CppointPO;

@Repository("cppointDao")
public class CppointDaoImpl extends DaoImpl<CppointPO> implements CppointDao {

	@Override
	public CppointPO queryCppoint(Long cid) {
		return (CppointPO) session().createCriteria(CppointPO.class).add(Restrictions.eq(CppointPO.COLUMN_CID_STR, cid)).uniqueResult();
	}

}
