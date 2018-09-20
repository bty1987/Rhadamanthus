package com.fanglin.customer.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.DecorationCircleBackgroundDao;
import com.fanglin.customer.po.DecorationCircleBackgroundPO;

@Repository("decorationCircleBackgroundDao")
public class DecorationCircleBackgroundDaoImpl extends DaoImpl<DecorationCircleBackgroundPO> implements DecorationCircleBackgroundDao{

	public DecorationCircleBackgroundDaoImpl(){
		super(DecorationCircleBackgroundPO.class);
	}

	@Override
	public DecorationCircleBackgroundPO queryDecorationCircleBackgroundByUnionId(String unionId) {
		return (DecorationCircleBackgroundPO) createCriteria(DecorationCircleBackgroundPO.class).add(Restrictions.eq(DecorationCircleBackgroundPO.COLUMN_UNIONID_STR, unionId)).uniqueResult();
	}
	
}
