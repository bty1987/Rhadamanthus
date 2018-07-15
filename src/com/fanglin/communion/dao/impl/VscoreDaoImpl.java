package com.fanglin.communion.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.VscoreDao;
import com.fanglin.communion.po.VscorePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("vscoreDao")
public class VscoreDaoImpl extends DaoImpl<VscorePO> implements VscoreDao {
	
	public VscoreDaoImpl(){
		super(VscorePO.class);
	}
	
	@Override
	public VscorePO queryVscoreByUnionId(String unionId) {
		return  (VscorePO) session().createCriteria(VscorePO.class).add(Restrictions.eq(VscorePO.COLUMN_UNIONID_STR, unionId)).uniqueResult();
	}

}
