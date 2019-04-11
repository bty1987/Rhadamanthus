package com.fanglin.decoration.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationBalanceDao;
import com.fanglin.decoration.po.DecorationBalancePO;

@Repository("decorationBalanceDao")
public class DecorationBalanceDaoImpl extends DaoImpl<DecorationBalancePO> implements DecorationBalanceDao {
	
	public DecorationBalanceDaoImpl(){
		super(DecorationBalancePO.class);
	}

	@Override
	public DecorationBalancePO queryDecorationBalance(Long doid) {
		
		return (DecorationBalancePO) session().createCriteria(DecorationBalancePO.class).createAlias("decoration", "decoration").add(Restrictions.eq(DecorationBalancePO.COLUMN_DOID_STR, doid)).uniqueResult();
	}

}
