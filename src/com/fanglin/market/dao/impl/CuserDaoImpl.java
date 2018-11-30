package com.fanglin.market.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.market.dao.CuserDao;
import com.fanglin.market.po.CuserPO;

@Repository("cuserDao")
public class CuserDaoImpl extends DaoImpl<CuserPO> implements CuserDao {
	
	public CuserDaoImpl(){
		super(CuserPO.class);
	}

	@Override
	public CuserPO queryCuserByUnionId(String unionId) {
		return (CuserPO) session().createCriteria(CuserPO.class).add(Restrictions.eq(CuserPO.COLUMN_UNIONID_STR, unionId)).uniqueResult();
	}

}
